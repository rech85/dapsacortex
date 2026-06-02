// lib/pos/store.ts
// Persistencia de ventas normalizadas.
//
// Diseño DynamoDB (single-table) propuesto:
//   PK = "VENTA#<venta_id>"      (clave natural → idempotente; re-envíos hacen upsert)
//   SK = "META"
//   GSI1: GSI1PK = "SUC#<sucursal_id>", GSI1SK = "<fecha ISO>"  → consultas por sucursal+rango
//   atributos: doc completo de la Venta + modulo, total, etc.
//
// Si POS_DDB_TABLE no está configurada, corre en modo "staging": valida y
// normaliza pero NO persiste (útil durante la fase de integración con DAPSA).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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

export interface PersistResult {
  persisted: number;
  staged: boolean;       // true si no hay tabla configurada (no se guardó)
}

export async function persistVentas(ventas: Venta[]): Promise<PersistResult> {
  const table = process.env.POS_DDB_TABLE;
  if (!table) {
    // Modo staging: aceptamos y normalizamos sin guardar todavía.
    return { persisted: 0, staged: true };
  }
  if (!ventas.length) return { persisted: 0, staged: false };

  const doc = docClient();
  let persisted = 0;

  // BatchWrite en lotes de 25 (límite DynamoDB)
  for (let i = 0; i < ventas.length; i += 25) {
    const chunk = ventas.slice(i, i + 25);
    const requests = chunk.map((v) => ({
      PutRequest: {
        Item: {
          PK: `VENTA#${v.venta_id}`,
          SK: "META",
          GSI1PK: `SUC#${v.sucursal_id}`,
          GSI1SK: v.fecha,
          ...v,
        },
      },
    }));

    let req: Record<string, typeof requests> = { [table]: requests };
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await doc.send(new BatchWriteCommand({ RequestItems: req }));
      const un = res.UnprocessedItems ?? {};
      if (!un[table] || un[table].length === 0) break;
      req = un as typeof req;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
    persisted += chunk.length;
  }

  return { persisted, staged: false };
}
