// lib/pos/types.ts
// Contrato de ingesta de tickets del POS de DAPSA.
//
// DAPSA hace el JOIN de encabezado+detalle de su lado (tal como describieron) y
// nos envía documentos "ticket" ya armados, conservando los nombres de campo
// originales de sus tablas. Nosotros normalizamos a un modelo unificado (Venta).
//
// Los campos crudos se tipan como opcionales + index signature porque su POS
// guarda casi todo como CHAR; aceptamos columnas extra sin romper.

export type ModuloPOS = "retail" | "mostrador";

// ── Crudo: Retail (pdvhdr / pdvdet) ──────────────────────────────────────────
export interface RetailHeaderRaw {
  Suc?: string;        // sucursal
  FecOpe?: string;     // fecha operación YYYYMMDD
  Caja?: string;
  NumTra?: string;     // # transacción
  Folio?: string;
  status?: string;
  cliente?: string;
  rfc_cte?: string;
  for_pgo?: string;    // forma de pago
  con_pgo?: string;    // condición de pago
  vendedor?: string;
  moneda?: string;
  tipo_cambio?: number;
  subtotal?: number;
  descto?: number;
  imp1?: number;
  imp2?: number;
  imp3?: number;
  TipoVenta?: string;
  turno?: string;
  fec_cob?: string;    // fecha cobro YYYYMMDD
  hra_cob?: string;    // hora HHMMSS
  [k: string]: unknown;
}

export interface RetailDetailRaw {
  cve_art?: string;        // SKU
  cod_barras?: string;
  des_art?: string;        // descripción
  modelo?: string;
  color?: string;
  talla?: string;
  cantidad?: number;
  devueltas?: number;
  precio?: number;
  subtotal?: number;
  descuento?: number;
  imp1?: number;
  imp2?: number;
  imp3?: number;
  subtotal_con_imp?: number;
  precio_con_imp?: number;
  precio_normal?: number;
  [k: string]: unknown;
}

// ── Crudo: Mostrador (pedped / peddet) ───────────────────────────────────────
export interface MostradorHeaderRaw {
  serie?: string;
  num?: string;
  par?: string;
  status?: string;
  alm?: string;        // almacén (lo usamos como sucursal si no hay Suc)
  cia?: string;
  for_pgo?: string;
  con_pgo?: string;
  moneda?: string;
  tipo_cambio?: number;
  ven?: string;        // vendedor
  cte?: string;        // cliente
  rfc_cte?: string;
  fac?: string;        // factura
  fec_ped?: string;    // fecha pedido YYYYMMDD
  hra_ped?: string;
  sub_tot?: number;
  desc_tot?: number;
  impn_tot?: number;   // impuesto normal
  impe_tot?: number;   // impuesto especial
  impe2_tot?: number;
  cos_tot?: number;    // costo total
  total_flete?: number;
  [k: string]: unknown;
}

export interface MostradorDetailRaw {
  serie?: string;
  cve?: string;        // = num del encabezado
  par?: string;
  cve_art?: string;    // SKU
  des?: string;        // descripción
  CodBar?: string;
  modelo?: string;
  color?: string;
  talla?: string;
  ped?: number;        // cantidad pedida
  sur?: number;        // surtida
  dev?: number;        // devuelta
  precio?: number;
  precio_con_iva?: number;
  costo?: number;
  total?: number;
  descto?: number;
  imp_nor?: number;
  imp_esp?: number;
  imp_esp2?: number;
  precio_normal?: number;
  [k: string]: unknown;
}

// ── Documento ticket recibido ────────────────────────────────────────────────
export interface TicketRetailIn {
  encabezado: RetailHeaderRaw;
  detalle: RetailDetailRaw[];
}
export interface TicketMostradorIn {
  encabezado: MostradorHeaderRaw;
  detalle: MostradorDetailRaw[];
}

// ── Envelope del POST ─────────────────────────────────────────────────────────
export interface IngestPayload {
  origen?: string;            // "dapsa-pos"
  modulo: ModuloPOS;
  enviado_en?: string;        // ISO 8601
  lote_id?: string;           // id de lote opcional (idempotencia/tracing)
  tickets: Array<TicketRetailIn | TicketMostradorIn>;
}

// ── Modelo normalizado interno (lo que consume la inteligencia) ───────────────
export interface VentaItem {
  sku: string;
  codigo_barras: string | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  impuestos: number;
  importe: number;            // importe de la línea con impuestos
  costo: number | null;       // disponible en mostrador (peddet.costo); null en retail
  atributos?: { modelo?: string; color?: string; talla?: string };
}

export interface Venta {
  venta_id: string;           // clave natural (idempotente)
  modulo: ModuloPOS;
  sucursal_id: string;
  caja_serie: string;
  folio: string | null;
  fecha: string;              // ISO 8601 (UTC) derivada de FecOpe/fec_ped + hora
  status: string | null;
  cliente_id: string | null;
  rfc_cliente: string | null;
  vendedor: string | null;
  forma_pago: string | null;
  condicion_pago: string | null;
  moneda: string;
  tipo_cambio: number;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  num_items: number;
  items: VentaItem[];
  recibido_en: string;        // ISO 8601 timestamp de ingesta
}

export interface IngestResult {
  ok: boolean;
  recibidos: number;
  aceptados: number;
  rechazados: number;
  errores: Array<{ indice: number; venta_id?: string; motivo: string }>;
  lote_id: string | null;
}
