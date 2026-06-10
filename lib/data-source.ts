// lib/data-source.ts
// Punto único que decide de dónde salen los tickets que alimentan la analítica:
//   - Datos REALES de DAPSA (DynamoDB) si POS_USE_REAL_DATA=1 y hay tabla.
//   - Datos MOCK (demostración) en caso contrario.
// Mantener este switch aquí evita que la analítica sepa de DynamoDB.

import { generateMockTickets, type Ticket } from "./mock-data";
import { listVentas } from "./pos/store";
import { ventaToTicket } from "./pos/to-ticket";

export function usingRealData(): boolean {
  return process.env.POS_USE_REAL_DATA === "1" && !!process.env.POS_DDB_TABLE;
}

export async function getTickets(): Promise<Ticket[]> {
  if (usingRealData()) {
    const ventas = await listVentas();
    return ventas.map(ventaToTicket);
  }
  return generateMockTickets();
}
