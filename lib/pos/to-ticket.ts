// lib/pos/to-ticket.ts
// Adapta una `Venta` normalizada (modelo de ingesta) al `Ticket` que consume la
// capa de analítica. Las dimensiones ausentes en el POS se resuelven vía catálogo
// con fallbacks: categoría = la del propio ticket, margen = catálogo (0 si se
// desconoce), tipo_cliente = "desconocido" hasta tener clasificación de DAPSA.

import type { Ticket, ProductoTicket } from "../mock-data";
import type { Venta } from "./types";
import { sucursalNombre } from "./catalog";

export function ventaToTicket(v: Venta): Ticket {
  const productos: ProductoTicket[] = (v.items ?? []).map((it) => ({
    id: it.sku || "(sin-sku)",
    nombre: it.descripcion || it.sku || "(sin nombre)",
    precio: it.precio_unitario,
    categoria: "Sin categoría", // hasta tener catálogo de productos de DAPSA
    cantidad: it.cantidad,
  }));

  return {
    ticket_id: v.venta_id,
    sucursal_id: v.sucursal_id,
    sucursal_nombre: sucursalNombre(v.sucursal_id),
    fecha: (v.fecha ?? "").slice(0, 10), // YYYY-MM-DD, como los tickets mock
    // Cliente: si el POS no manda cliente, cada ticket es un anónimo distinto
    // (no los colapsamos en uno solo, lo cual falsearía la frecuencia).
    cliente_id: v.cliente_id ?? `anon:${v.venta_id}`,
    tipo_cliente: "desconocido",
    productos,
    total: v.total,
  };
}
