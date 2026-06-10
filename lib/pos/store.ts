// lib/pos/store.ts
// Persistencia y lectura de ventas del POS de DAPSA.
//
// Diseño DynamoDB (single-table):
//   Venta normalizada:
//     PK = "VENTA#<venta_id>"   SK = "META"   (clave natural → idempotente; re-envíos = upsert)
//     GSI1PK = "SUC#<sucursal_id>"   GSI1SK = "<fecha ISO>"   → consultas por sucursal+rango
//     tipo = "venta" + doc completo de la Venta
//
//   Archivo crudo (raw) — TODO ticket recibido, aceptado o rechazado:
//     PK = "RAW#<sha256(ticket)>"   SK = "META"   (idempotente por contenido)
//     tipo = "raw" + { modulo, recibido_en, lote_id, indice, estado, motivo?, venta_id?, raw }
//   El raw es la red de seguridad: si la normalización tiene un bug, el ticket
//   original nunca se pierde y puede re-procesarse.
//
// Si POS_DDB_TABLE no está configurada, corre en modo "staging": valida y
// normaliza pero NO persiste (útil durante la fase de integración con DAPSA).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";
import type { Venta } from "./types";

let _doc: DynamoDBDocumentClient | null = null;
function docClient(): DynamoDBDocumentClient {
  if (!_doc) {
    const region = process.env.POS_DDB_REGION || process.env.AWS_REGION || "us-east-1";
    // Credenciales dedicadas (usuario IAM de mínimo privilegio) vía env vars
    // propias, para no interferir con el entorno AWS del runtime de Amplify.
    // Si no están, cae al credential chain por defecto (rol/local).
    const accessKeyId = process.env.POS_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.POS_AWS_SECRET_ACCESS_KEY;
    const credentials =
      accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

    _doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region, credentials }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return _doc;
}

export function tableName(): string | null {
  return process.env.POS_DDB_TABLE || null;
}

const INDEX_GSI1 = process.env.POS_DDB_GSI1 || "GSI1";

// ── Escritura ────────────────────────────────────────────────────────────────

export interface PersistResult {
  persisted: number;
  staged: boolean;       // true si no hay tabla configurada (no se guardó)
}

// Escribe en lotes de 25 con reintentos. A diferencia de la versión previa, NO
// cuenta como persistido lo que DynamoDB deje sin procesar: lanza error con el
// faltante para que el caller lo refleje (garantía: aceptado == guardado).
async function batchWriteAll(
  table: string,
  items: Record<string, unknown>[],
): Promise<number> {
  const doc = docClient();
  let persisted = 0;

  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    let req: Record<string, { PutRequest: { Item: Record<string, unknown> } }[]> = {
      [table]: chunk.map((Item) => ({ PutRequest: { Item } })),
    };

    let remaining = chunk.length;
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await doc.send(new BatchWriteCommand({ RequestItems: req }));
      const un = res.UnprocessedItems ?? {};
      const left = un[table]?.length ?? 0;
      remaining = left;
      if (left === 0) break;
      req = un as typeof req;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }

    if (remaining > 0) {
      // No mentimos sobre la durabilidad: lo que no se confirmó, no se guardó.
      throw new Error(
        `DynamoDB dejó ${remaining} de ${chunk.length} ítems sin procesar tras 5 reintentos`,
      );
    }
    persisted += chunk.length;
  }

  return persisted;
}

export async function persistVentas(ventas: Venta[]): Promise<PersistResult> {
  const table = tableName();
  if (!table) {
    // Modo staging: aceptamos y normalizamos sin guardar todavía.
    return { persisted: 0, staged: true };
  }
  if (!ventas.length) return { persisted: 0, staged: false };

  const items = ventas.map((v) => ({
    PK: `VENTA#${v.venta_id}`,
    SK: "META",
    GSI1PK: `SUC#${v.sucursal_id}`,
    GSI1SK: v.fecha,
    tipo: "venta",
    ...v,
  }));

  const persisted = await batchWriteAll(table, items);
  return { persisted, staged: false };
}

export interface RawRecord {
  modulo: string;
  recibido_en: string;
  lote_id: string | null;
  indice: number;
  estado: "aceptado" | "rechazado";
  motivo?: string;
  venta_id?: string;
  raw: unknown;
}

// Archiva TODO ticket recibido (aceptado o rechazado) por hash de contenido.
// Idempotente: re-enviar el mismo ticket no duplica. Best-effort: si falla, no
// debe tumbar la ingesta (el raw es respaldo, no la fuente primaria de la API).
export async function persistRaw(records: RawRecord[]): Promise<PersistResult> {
  const table = tableName();
  if (!table) return { persisted: 0, staged: true };
  if (!records.length) return { persisted: 0, staged: false };

  const items = records.map((r) => {
    const hash = createHash("sha256").update(JSON.stringify(r.raw)).digest("hex");
    return {
      PK: `RAW#${hash}`,
      SK: "META",
      tipo: "raw",
      ...r,
    };
  });

  const persisted = await batchWriteAll(table, items);
  return { persisted, staged: false };
}

// ── Lectura ──────────────────────────────────────────────────────────────────

export async function getVenta(venta_id: string): Promise<Venta | null> {
  const table = tableName();
  if (!table) return null;
  const doc = docClient();
  const res = await doc.send(
    new GetCommand({ TableName: table, Key: { PK: `VENTA#${venta_id}`, SK: "META" } }),
  );
  return (res.Item as Venta) ?? null;
}

// Consulta por sucursal y (opcional) rango de fechas ISO, vía GSI1.
export async function queryVentasBySucursal(
  sucursalId: string,
  desde?: string,
  hasta?: string,
): Promise<Venta[]> {
  const table = tableName();
  if (!table) return [];
  const doc = docClient();

  let KeyConditionExpression = "GSI1PK = :pk";
  const ExpressionAttributeValues: Record<string, unknown> = { ":pk": `SUC#${sucursalId}` };
  if (desde && hasta) {
    KeyConditionExpression += " AND GSI1SK BETWEEN :d AND :h";
    ExpressionAttributeValues[":d"] = desde;
    ExpressionAttributeValues[":h"] = hasta;
  } else if (desde) {
    KeyConditionExpression += " AND GSI1SK >= :d";
    ExpressionAttributeValues[":d"] = desde;
  }

  const out: Venta[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await doc.send(
      new QueryCommand({
        TableName: table,
        IndexName: INDEX_GSI1,
        KeyConditionExpression,
        ExpressionAttributeValues,
        ExclusiveStartKey,
      }),
    );
    for (const it of res.Items ?? []) out.push(it as Venta);
    ExclusiveStartKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);

  return out;
}

// Lista todas las ventas (scan paginado, filtrando solo items tipo "venta").
// Adecuado para la fase actual (volumen bajo). A escala se reemplaza por queries
// por sucursal+fecha o por un agregado materializado.
export async function listVentas(limit?: number): Promise<Venta[]> {
  const table = tableName();
  if (!table) return [];
  const doc = docClient();

  const out: Venta[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await doc.send(
      new ScanCommand({
        TableName: table,
        FilterExpression: "tipo = :t",
        ExpressionAttributeValues: { ":t": "venta" },
        ExclusiveStartKey,
      }),
    );
    for (const it of res.Items ?? []) {
      out.push(it as Venta);
      if (limit && out.length >= limit) return out;
    }
    ExclusiveStartKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);

  return out;
}
