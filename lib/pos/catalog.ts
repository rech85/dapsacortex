// lib/pos/catalog.ts
// Catálogo de enriquecimiento: dimensiones que los tickets crudos del POS NO
// traen (margen por producto, categoría canónica, nombre de sucursal, tipo de
// cliente). Hoy DAPSA aún no nos comparte estos maestros, así que devolvemos
// fallbacks seguros. Cuando lleguen, este módulo es el único punto a cambiar
// (cargar desde JSON, DynamoDB, etc.) sin tocar la analítica.

import { PRODUCTOS_BASE } from "../mock-data";

// Margen por SKU. El maestro mock cubre el catálogo de demostración; para SKUs
// reales de DAPSA aún no tenemos margen → 0 (no asumimos rentabilidad inventada).
const MARGIN_BY_ID = new Map<string, number>(PRODUCTOS_BASE.map((p) => [p.id, p.margen]));

export function margenSku(sku: string): number {
  return MARGIN_BY_ID.get(sku) ?? 0;
}

// Nombre legible de sucursal. Sin maestro de sucursales, mostramos el propio id
// (p.ej. "ABA"), que ya es informativo.
export function sucursalNombre(sucursalId: string): string {
  return sucursalId;
}

// Categoría canónica por SKU. Sin maestro de productos, el ticket ya trae su
// propia categoría/descr.; este hook permite reclasificar cuando llegue.
export function categoriaSku(_sku: string, categoriaEnTicket: string): string {
  return categoriaEnTicket;
}
