// app/api/pos/ingest/route.ts
// Endpoint de ingesta de tickets del POS de DAPSA.
//   POST /api/pos/ingest   → recibe un lote de tickets (retail | mostrador)
//   GET  /api/pos/ingest   → health check / descripción del contrato
//
// Auth: header x-api-key (obligatorio) + x-pos-signature HMAC-SHA256 (si hay secreto).
// Normaliza al modelo Venta y persiste (DynamoDB si está configurado; staging si no).

import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/pos/auth";
import { normalizeRetail, normalizeMostrador, validarVenta } from "@/lib/pos/normalize";
import { persistVentas, persistRaw, type RawRecord } from "@/lib/pos/store";
import type {
  IngestPayload,
  IngestResult,
  Venta,
  TicketRetailIn,
  TicketMostradorIn,
} from "@/lib/pos/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TICKETS = 5000; // tope por lote

export async function GET() {
  return NextResponse.json({
    servicio: "DAPSA Cortex — Ingesta POS",
    metodo: "POST /api/pos/ingest",
    auth: ["x-api-key (obligatorio)", "x-pos-signature: hex(HMAC-SHA256(body, secreto)) (recomendado)"],
    modulos: ["retail", "mostrador"],
    envelope: {
      origen: "dapsa-pos",
      modulo: "retail | mostrador",
      enviado_en: "ISO-8601",
      lote_id: "opcional",
      tickets: [{ encabezado: "{...}", detalle: ["{...}"] }],
    },
    max_tickets_por_lote: MAX_TICKETS,
  });
}

export async function POST(request: NextRequest) {
  // 1) Body crudo (necesario para validar la firma HMAC sobre los bytes exactos)
  const rawBody = await request.text();

  // 2) Autenticación
  const auth = authenticate(request.headers, rawBody);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.motivo }, { status: auth.status });
  }

  // 3) Parseo + validación del envelope
  let payload: IngestPayload;
  try {
    payload = JSON.parse(rawBody) as IngestPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  if (!payload || (payload.modulo !== "retail" && payload.modulo !== "mostrador")) {
    return NextResponse.json({ ok: false, error: "modulo debe ser 'retail' o 'mostrador'" }, { status: 400 });
  }
  if (!Array.isArray(payload.tickets)) {
    return NextResponse.json({ ok: false, error: "tickets debe ser un arreglo" }, { status: 400 });
  }
  if (payload.tickets.length > MAX_TICKETS) {
    return NextResponse.json(
      { ok: false, error: `máximo ${MAX_TICKETS} tickets por lote (recibidos ${payload.tickets.length})` },
      { status: 413 },
    );
  }

  // 4) Normalización + validación por ticket
  const recibidoEn = new Date().toISOString();
  const ventas: Venta[] = [];
  const errores: IngestResult["errores"] = [];
  const raws: RawRecord[] = [];

  payload.tickets.forEach((t, indice) => {
    // Archivamos SIEMPRE el ticket crudo, aceptado o rechazado, para no perder
    // nada y poder re-procesar si la normalización cambia.
    const rawBase = { modulo: payload.modulo, recibido_en: recibidoEn, lote_id: payload.lote_id ?? null, indice, raw: t };
    try {
      const venta =
        payload.modulo === "retail"
          ? normalizeRetail(t as TicketRetailIn, recibidoEn)
          : normalizeMostrador(t as TicketMostradorIn, recibidoEn);

      const motivo = validarVenta(venta);
      if (motivo) {
        errores.push({ indice, venta_id: venta.venta_id, motivo });
        raws.push({ ...rawBase, estado: "rechazado", motivo, venta_id: venta.venta_id });
        return;
      }
      ventas.push(venta);
      raws.push({ ...rawBase, estado: "aceptado", venta_id: venta.venta_id });
    } catch (e) {
      const motivo = `error al normalizar: ${(e as Error).message}`;
      errores.push({ indice, motivo });
      raws.push({ ...rawBase, estado: "rechazado", motivo });
    }
  });

  // 5) Persistencia. El raw es best-effort (respaldo); las ventas normalizadas
  // son la fuente primaria de la API y sí deben confirmarse.
  let staged = false;
  let rawError: string | null = null;
  try {
    await persistRaw(raws);
  } catch (e) {
    // No tumbamos la ingesta por un fallo del respaldo, pero lo reportamos.
    rawError = (e as Error).message;
  }
  try {
    const res = await persistVentas(ventas);
    staged = res.staged;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `fallo al persistir: ${(e as Error).message}`, aceptados: 0 },
      { status: 502 },
    );
  }

  const result: IngestResult & { staging?: boolean } = {
    ok: errores.length === 0,
    recibidos: payload.tickets.length,
    aceptados: ventas.length,
    rechazados: errores.length,
    errores,
    lote_id: payload.lote_id ?? null,
    ...(staged ? { staging: true } : {}),
    ...(rawError ? { raw_warning: rawError } : {}),
  };

  // 207 si hubo aceptados y rechazados; 200 si todo ok; 422 si todo falló
  const status = ventas.length === 0 ? 422 : errores.length > 0 ? 207 : 200;
  return NextResponse.json(result, { status });
}
