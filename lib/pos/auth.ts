// lib/pos/auth.ts
// Autenticación del endpoint de ingesta:
//  1) API key obligatoria en header `x-api-key` (comparación en tiempo constante).
//  2) Firma HMAC-SHA256 opcional pero recomendada en `x-pos-signature`:
//     hex(HMAC_SHA256(rawBody, POS_INGEST_SECRET)). Evita manipulación/replay.
//
// Secrets vía variables de entorno (Amplify env vars / Secrets):
//   POS_INGEST_API_KEY   — clave compartida con DAPSA (obligatoria)
//   POS_INGEST_SECRET    — secreto para HMAC (opcional; si está, la firma es obligatoria)

import { createHmac, timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export interface AuthResult {
  ok: boolean;
  status: number;     // 401 / 403 / 500
  motivo?: string;
}

export function authenticate(headers: Headers, rawBody: string): AuthResult {
  const expectedKey = process.env.POS_INGEST_API_KEY;
  if (!expectedKey) {
    // Mal configurado: nunca aceptar si no hay clave definida en el servidor.
    return { ok: false, status: 500, motivo: "POS_INGEST_API_KEY no configurada en el servidor" };
  }

  const apiKey = headers.get("x-api-key") ?? "";
  if (!apiKey || !safeEqual(apiKey, expectedKey)) {
    return { ok: false, status: 401, motivo: "x-api-key inválida o ausente" };
  }

  const secret = process.env.POS_INGEST_SECRET;
  if (secret) {
    const sig = (headers.get("x-pos-signature") ?? "").trim().toLowerCase();
    if (!sig) return { ok: false, status: 401, motivo: "falta x-pos-signature (HMAC requerido)" };
    const expectedSig = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
    if (!safeEqual(sig, expectedSig)) {
      return { ok: false, status: 403, motivo: "firma HMAC inválida" };
    }
  }

  return { ok: true, status: 200 };
}
