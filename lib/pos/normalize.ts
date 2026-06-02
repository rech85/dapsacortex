// lib/pos/normalize.ts
// Mapea los documentos crudos del POS (retail / mostrador) al modelo unificado Venta.

import type {
  TicketRetailIn,
  TicketMostradorIn,
  Venta,
  VentaItem,
} from "./types";

// CHAR money llega como número o string; lo volvemos número seguro.
function num(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

// FecOpe = "YYYYMMDD", hora = "HHMMSS" → ISO 8601 (se asume hora local de tienda).
// Si la fecha es inválida, regresa null para que el caller la rechace.
export function toISO(fecha?: string | null, hora?: string | null): string | null {
  const f = (fecha ?? "").trim();
  if (!/^\d{8}$/.test(f)) return null;
  const y = f.slice(0, 4), mo = f.slice(4, 6), d = f.slice(6, 8);
  const h = (hora ?? "").trim().padEnd(6, "0");
  const hh = /^\d{6}$/.test(h) ? h.slice(0, 2) : "00";
  const mm = /^\d{6}$/.test(h) ? h.slice(2, 4) : "00";
  const ss = /^\d{6}$/.test(h) ? h.slice(4, 6) : "00";
  const iso = `${y}-${mo}-${d}T${hh}:${mm}:${ss}`;
  const dt = new Date(iso);
  return Number.isNaN(dt.getTime()) ? null : iso;
}

export function normalizeRetail(t: TicketRetailIn, recibidoEn: string): Venta {
  const h = t.encabezado ?? ({} as TicketRetailIn["encabezado"]);
  const suc = (str(h.Suc) ?? "").padStart(3, "0");
  const caja = str(h.Caja) ?? "";
  const fecOpe = str(h.FecOpe) ?? "";
  const numTra = str(h.NumTra) ?? "";

  const items: VentaItem[] = (t.detalle ?? []).map((d) => {
    const importe = num(d.subtotal_con_imp) || (num(d.subtotal) + num(d.imp1) + num(d.imp2) + num(d.imp3));
    return {
      sku: str(d.cve_art) ?? "",
      codigo_barras: str(d.cod_barras),
      descripcion: str(d.des_art) ?? "",
      cantidad: num(d.cantidad) - num(d.devueltas),
      precio_unitario: num(d.precio),
      descuento: num(d.descuento),
      impuestos: num(d.imp1) + num(d.imp2) + num(d.imp3),
      importe,
      costo: null, // retail no manda costo
      atributos: { modelo: str(d.modelo) ?? undefined, color: str(d.color) ?? undefined, talla: str(d.talla) ?? undefined },
    };
  });

  const impuestos = num(h.imp1) + num(h.imp2) + num(h.imp3);
  const subtotal = num(h.subtotal);
  const descuento = num(h.descto);

  return {
    venta_id: `retail:${suc}:${fecOpe}:${caja}:${numTra}`,
    modulo: "retail",
    sucursal_id: suc,
    caja_serie: caja,
    folio: str(h.Folio),
    fecha: toISO(fecOpe, str(h.hra_cob)) ?? `${fecOpe.slice(0,4)}-${fecOpe.slice(4,6)}-${fecOpe.slice(6,8)}T00:00:00`,
    status: str(h.status),
    cliente_id: str(h.cliente),
    rfc_cliente: str(h.rfc_cte),
    vendedor: str(h.vendedor),
    forma_pago: str(h.for_pgo),
    condicion_pago: str(h.con_pgo),
    moneda: str(h.moneda) ?? "MXN",
    tipo_cambio: num(h.tipo_cambio) || 1,
    subtotal,
    descuento,
    impuestos,
    total: subtotal - descuento + impuestos,
    num_items: items.length,
    items,
    recibido_en: recibidoEn,
  };
}

export function normalizeMostrador(t: TicketMostradorIn, recibidoEn: string): Venta {
  const h = t.encabezado ?? ({} as TicketMostradorIn["encabezado"]);
  const serie = str(h.serie) ?? "";
  const numDoc = str(h.num) ?? "";

  const items: VentaItem[] = (t.detalle ?? []).map((d) => {
    const cantidad = num(d.sur) || num(d.ped);
    return {
      sku: str(d.cve_art) ?? "",
      codigo_barras: str(d.CodBar),
      descripcion: str(d.des) ?? "",
      cantidad: cantidad - num(d.dev),
      precio_unitario: num(d.precio),
      descuento: num(d.descto),
      impuestos: num(d.imp_nor) + num(d.imp_esp) + num(d.imp_esp2),
      importe: num(d.total),
      costo: str(d.costo) !== null ? num(d.costo) : null,
      atributos: { modelo: str(d.modelo) ?? undefined, color: str(d.color) ?? undefined, talla: str(d.talla) ?? undefined },
    };
  });

  const subtotal = num(h.sub_tot);
  const descuento = num(h.desc_tot);
  const impuestos = num(h.impn_tot) + num(h.impe_tot) + num(h.impe2_tot);
  const flete = num(h.total_flete);

  return {
    venta_id: `mostrador:${serie}:${numDoc}`,
    modulo: "mostrador",
    sucursal_id: str(h.alm) ?? str(h.cia) ?? "",
    caja_serie: serie,
    folio: str(h.fac) ?? numDoc,
    fecha: toISO(str(h.fec_ped), str(h.hra_ped)) ?? new Date(0).toISOString(),
    status: str(h.status),
    cliente_id: str(h.cte),
    rfc_cliente: str(h.rfc_cte),
    vendedor: str(h.ven),
    forma_pago: str(h.for_pgo),
    condicion_pago: str(h.con_pgo),
    moneda: str(h.moneda) ?? "MXN",
    tipo_cambio: num(h.tipo_cambio) || 1,
    subtotal,
    descuento,
    impuestos,
    total: subtotal - descuento + impuestos + flete,
    num_items: items.length,
    items,
    recibido_en: recibidoEn,
  };
}

// Valida que la venta normalizada tenga las claves mínimas para identificarse.
export function validarVenta(v: Venta): string | null {
  if (v.modulo === "retail") {
    const ok = v.sucursal_id && v.caja_serie && v.venta_id.split(":").every((p) => p.length > 0) &&
      /retail:\d{3}:\d{8}:.+:.+/.test(v.venta_id);
    if (!ok) return "faltan claves retail (Suc/FecOpe/Caja/NumTra) o FecOpe no es YYYYMMDD";
  } else {
    if (!str(v.caja_serie) || v.venta_id === "mostrador::") return "faltan claves mostrador (serie/num)";
  }
  if (!v.items.length) return "ticket sin detalle (items vacíos)";
  return null;
}
