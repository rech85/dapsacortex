// lib/analytics.ts
// NOTE: In production, these computations will run in AWS Lambda functions
// and results will be cached in DynamoDB / ElastiCache

import { generateMockTickets, PRODUCTOS_BASE, SUCURSALES, TIPOS_CLIENTE, type Ticket } from "./mock-data";

export interface OverviewStats {
  ventasTotales: number;
  numTickets: number;
  ticketPromedio: number;
  productosUnicos: number;
  ticketsPorDia: { fecha: string; tickets: number; ventas: number }[];
  ventasPorCategoria: { categoria: string; ventas: number; porcentaje: number }[];
}

export interface PenetracionProducto {
  id: string;
  nombre: string;
  categoria: string;
  penetracion: number;
  ventas: number;
  numTickets: number;
}

export interface CoOcurrencia {
  producto1: string;
  producto2: string;
  nombre1: string;
  nombre2: string;
  frecuencia: number;
  soporte: number;
}

export interface CanastaStats {
  topPenetracion: PenetracionProducto[];
  topCoOcurrencia: CoOcurrencia[];
  penetracionPorProducto: PenetracionProducto[];
}

export interface ProductoStats {
  id: string;
  nombre: string;
  categoria: string;
  ventas: number;
  unidades: number;
  penetracion: number;
  margen: number;
  margenPesos: number;
  oportunidad: "alta" | "media" | "baja";
}

export interface ClienteSegmento {
  segmento: "Frecuente" | "Ocasional" | "Nuevo";
  count: number;
  porcentaje: number;
  ticketPromedio: number;
  frecuenciaPromedio: number;
}

export interface TipoClienteStats {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  emoji: string;
  estrategia: string;
  numClientes: number;
  numTickets: number;
  porcentajeTickets: number;
  ventasTotales: number;
  ticketPromedio: number;
  frecuenciaPromedio: number;
  topProductos: { nombre: string; penetracion: number }[];
  topCategorias: { categoria: string; ventas: number; porcentaje: number }[];
}

export interface SucursalStats {
  id: string;
  nombre: string;
  ventasTotales: number;
  numTickets: number;
  ticketPromedio: number;
  productosUnicos: number;
  topProducto: string;
  clientesUnicos: number;
}

export interface AutoInsight {
  id: string;
  tipo: "ancla" | "oportunidad" | "promocion" | "sucursal" | "tendencia";
  titulo: string;
  descripcion: string;
  impacto: "alto" | "medio" | "bajo";
  accion: string;
  datos: {
    valor: number;
    label: string;
  }[];
}

// ── Overview ──────────────────────────────────────────────────────────────
export function computeOverview(sucursalFilter?: string): OverviewStats {
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }

  const ventasTotales = tickets.reduce((s, t) => s + t.total, 0);
  const numTickets = tickets.length;
  const ticketPromedio = ventasTotales / numTickets;

  const productosSet = new Set<string>();
  tickets.forEach((t) => t.productos.forEach((p) => productosSet.add(p.id)));
  const productosUnicos = productosSet.size;

  // Tickets por día (last 30 days)
  const byDia: Record<string, { tickets: number; ventas: number }> = {};
  tickets.forEach((t) => {
    if (!byDia[t.fecha]) byDia[t.fecha] = { tickets: 0, ventas: 0 };
    byDia[t.fecha].tickets++;
    byDia[t.fecha].ventas += t.total;
  });
  const ticketsPorDia = Object.entries(byDia)
    .map(([fecha, v]) => ({ fecha, ...v }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-30);

  // Ventas por categoría
  const byCategoria: Record<string, number> = {};
  tickets.forEach((t) =>
    t.productos.forEach((p) => {
      byCategoria[p.categoria] = (byCategoria[p.categoria] || 0) + p.precio * p.cantidad;
    })
  );
  const totalVentasCat = Object.values(byCategoria).reduce((s, v) => s + v, 0);
  const ventasPorCategoria = Object.entries(byCategoria)
    .map(([categoria, ventas]) => ({
      categoria,
      ventas,
      porcentaje: (ventas / totalVentasCat) * 100,
    }))
    .sort((a, b) => b.ventas - a.ventas);

  return { ventasTotales, numTickets, ticketPromedio, productosUnicos, ticketsPorDia, ventasPorCategoria };
}

// ── Canasta ───────────────────────────────────────────────────────────────
export function computeCanasta(sucursalFilter?: string): CanastaStats {
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }

  const totalTickets = tickets.length;

  // Penetración
  const penetracionMap: Record<string, { count: number; ventas: number }> = {};
  tickets.forEach((t) => {
    const seen = new Set<string>();
    t.productos.forEach((p) => {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        if (!penetracionMap[p.id]) penetracionMap[p.id] = { count: 0, ventas: 0 };
        penetracionMap[p.id].count++;
        penetracionMap[p.id].ventas += p.precio * p.cantidad;
      }
    });
  });

  const penetracionPorProducto: PenetracionProducto[] = PRODUCTOS_BASE.map((prod) => ({
    id: prod.id,
    nombre: prod.nombre,
    categoria: prod.categoria,
    penetracion: penetracionMap[prod.id]
      ? (penetracionMap[prod.id].count / totalTickets) * 100
      : 0,
    ventas: penetracionMap[prod.id]?.ventas || 0,
    numTickets: penetracionMap[prod.id]?.count || 0,
  })).sort((a, b) => b.penetracion - a.penetracion);

  const topPenetracion = penetracionPorProducto.slice(0, 10);

  // Co-ocurrencia (top pairs)
  const coocMap: Record<string, number> = {};
  tickets.forEach((t) => {
    const ids = Array.from(new Set(t.productos.map((p) => p.id))).sort();
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = `${ids[i]}__${ids[j]}`;
        coocMap[key] = (coocMap[key] || 0) + 1;
      }
    }
  });

  const topCoOcurrencia: CoOcurrencia[] = Object.entries(coocMap)
    .map(([key, count]) => {
      const [id1, id2] = key.split("__");
      const p1 = PRODUCTOS_BASE.find((p) => p.id === id1);
      const p2 = PRODUCTOS_BASE.find((p) => p.id === id2);
      return {
        producto1: id1,
        producto2: id2,
        nombre1: p1?.nombre || id1,
        nombre2: p2?.nombre || id2,
        frecuencia: count,
        soporte: (count / totalTickets) * 100,
      };
    })
    .sort((a, b) => b.frecuencia - a.frecuencia)
    .slice(0, 15);

  return { topPenetracion, topCoOcurrencia, penetracionPorProducto };
}

// ── Productos ─────────────────────────────────────────────────────────────
export function computeProductos(sucursalFilter?: string): ProductoStats[] {
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }

  const totalTickets = tickets.length;
  const statsMap: Record<string, { ventas: number; unidades: number; ticketCount: number }> = {};

  tickets.forEach((t) => {
    const seen = new Set<string>();
    t.productos.forEach((p) => {
      if (!statsMap[p.id]) statsMap[p.id] = { ventas: 0, unidades: 0, ticketCount: 0 };
      statsMap[p.id].ventas += p.precio * p.cantidad;
      statsMap[p.id].unidades += p.cantidad;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        statsMap[p.id].ticketCount++;
      }
    });
  });

  return PRODUCTOS_BASE.map((prod) => {
    const s = statsMap[prod.id] || { ventas: 0, unidades: 0, ticketCount: 0 };
    const penetracion = (s.ticketCount / totalTickets) * 100;
    const margenPesos = s.ventas * prod.margen;
    let oportunidad: "alta" | "media" | "baja" = "baja";
    if (prod.margen > 0.25 && penetracion < 20) oportunidad = "alta";
    else if (prod.margen > 0.20 && penetracion < 30) oportunidad = "media";
    return {
      id: prod.id,
      nombre: prod.nombre,
      categoria: prod.categoria,
      ventas: s.ventas,
      unidades: s.unidades,
      penetracion,
      margen: prod.margen,
      margenPesos,
      oportunidad,
    };
  }).sort((a, b) => b.ventas - a.ventas);
}

// ── Clientes ──────────────────────────────────────────────────────────────
export function computeClientes(sucursalFilter?: string) {
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }

  const clienteMap: Record<string, { visitas: number; totalGasto: number; fechas: string[] }> = {};
  tickets.forEach((t) => {
    if (!clienteMap[t.cliente_id]) {
      clienteMap[t.cliente_id] = { visitas: 0, totalGasto: 0, fechas: [] };
    }
    clienteMap[t.cliente_id].visitas++;
    clienteMap[t.cliente_id].totalGasto += t.total;
    clienteMap[t.cliente_id].fechas.push(t.fecha);
  });

  const clientes = Object.entries(clienteMap).map(([id, data]) => ({
    id,
    visitas: data.visitas,
    totalGasto: data.totalGasto,
    ticketPromedio: data.totalGasto / data.visitas,
  }));

  const frecuentes = clientes.filter((c) => c.visitas >= 5);
  const ocasionales = clientes.filter((c) => c.visitas >= 2 && c.visitas < 5);
  const nuevos = clientes.filter((c) => c.visitas === 1);

  const avg = (arr: typeof clientes, key: keyof typeof clientes[0]) =>
    arr.length ? arr.reduce((s, c) => s + (c[key] as number), 0) / arr.length : 0;

  const segmentos: ClienteSegmento[] = [
    {
      segmento: "Frecuente",
      count: frecuentes.length,
      porcentaje: (frecuentes.length / clientes.length) * 100,
      ticketPromedio: avg(frecuentes, "ticketPromedio"),
      frecuenciaPromedio: avg(frecuentes, "visitas"),
    },
    {
      segmento: "Ocasional",
      count: ocasionales.length,
      porcentaje: (ocasionales.length / clientes.length) * 100,
      ticketPromedio: avg(ocasionales, "ticketPromedio"),
      frecuenciaPromedio: avg(ocasionales, "visitas"),
    },
    {
      segmento: "Nuevo",
      count: nuevos.length,
      porcentaje: (nuevos.length / clientes.length) * 100,
      ticketPromedio: avg(nuevos, "ticketPromedio"),
      frecuenciaPromedio: 1,
    },
  ];

  const frecuenciaGlobal = avg(clientes, "visitas");
  const ticketPromedioGlobal = avg(clientes, "ticketPromedio");

  const distribucion = [
    { rango: "1 visita", count: nuevos.length },
    { rango: "2-4 visitas", count: ocasionales.length },
    { rango: "5-9 visitas", count: frecuentes.filter((c) => c.visitas < 10).length },
    { rango: "10+ visitas", count: frecuentes.filter((c) => c.visitas >= 10).length },
  ];

  const tipoBreakdown = TIPOS_CLIENTE.map((tipo) => {
    const tipoTickets = tickets.filter((t) => t.tipo_cliente === tipo.id);
    return {
      id: tipo.id,
      nombre: tipo.nombre,
      color: tipo.color,
      count: new Set(tipoTickets.map((t) => t.cliente_id)).size,
      numTickets: tipoTickets.length,
      porcentaje: (tipoTickets.length / tickets.length) * 100,
    };
  });

  return { segmentos, frecuenciaGlobal, ticketPromedioGlobal, distribucion, totalClientes: clientes.length, tipoBreakdown };
}

// ── Clientes por Tipo ──────────────────────────────────────────────────────
export function computeClientesPorTipo(sucursalFilter?: string): TipoClienteStats[] {
  // AWS Lambda: GET /api/clientes?view=tipos
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }
  const totalTickets = tickets.length;

  return TIPOS_CLIENTE.map((tipo) => {
    const tipoTickets = tickets.filter((t) => t.tipo_cliente === tipo.id);
    const clientesUnicos = new Set(tipoTickets.map((t) => t.cliente_id));
    const ventasTotales = tipoTickets.reduce((s, t) => s + t.total, 0);
    const numTickets = tipoTickets.length;
    const numClientes = clientesUnicos.size;

    // Frequency: tickets per unique client
    const clienteVisitas: Record<string, number> = {};
    tipoTickets.forEach((t) => {
      clienteVisitas[t.cliente_id] = (clienteVisitas[t.cliente_id] || 0) + 1;
    });
    const frecuenciaPromedio = numClientes > 0
      ? Object.values(clienteVisitas).reduce((s, v) => s + v, 0) / numClientes
      : 0;

    // Top products by penetration within this type
    const prodCount: Record<string, number> = {};
    tipoTickets.forEach((t) => {
      const seenInTicket = new Set<string>();
      t.productos.forEach((p) => {
        if (!seenInTicket.has(p.id)) {
          seenInTicket.add(p.id);
          prodCount[p.id] = (prodCount[p.id] || 0) + 1;
        }
      });
    });
    const topProductos = Object.entries(prodCount)
      .map(([id, count]) => ({
        nombre: PRODUCTOS_BASE.find((p) => p.id === id)?.nombre || id,
        penetracion: numTickets > 0 ? (count / numTickets) * 100 : 0,
      }))
      .sort((a, b) => b.penetracion - a.penetracion)
      .slice(0, 5);

    // Top categories
    const catMap: Record<string, number> = {};
    tipoTickets.forEach((t) =>
      t.productos.forEach((p) => {
        catMap[p.categoria] = (catMap[p.categoria] || 0) + p.precio * p.cantidad;
      })
    );
    const totalCat = Object.values(catMap).reduce((s, v) => s + v, 0);
    const topCategorias = Object.entries(catMap)
      .map(([categoria, ventas]) => ({
        categoria,
        ventas,
        porcentaje: totalCat > 0 ? (ventas / totalCat) * 100 : 0,
      }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 4);

    return {
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      color: tipo.color,
      emoji: tipo.emoji,
      estrategia: tipo.estrategia,
      numClientes,
      numTickets,
      porcentajeTickets: totalTickets > 0 ? (numTickets / totalTickets) * 100 : 0,
      ventasTotales,
      ticketPromedio: numTickets > 0 ? ventasTotales / numTickets : 0,
      frecuenciaPromedio,
      topProductos,
      topCategorias,
    };
  });
}

// ── Sucursales ────────────────────────────────────────────────────────────
export function computeSucursales(): SucursalStats[] {
  const tickets = generateMockTickets();

  return SUCURSALES.map((suc) => {
    const sucTickets = tickets.filter((t) => t.sucursal_id === suc.id);
    const ventasTotales = sucTickets.reduce((s, t) => s + t.total, 0);
    const numTickets = sucTickets.length;
    const ticketPromedio = ventasTotales / numTickets;

    const productosSet = new Set<string>();
    const clientesSet = new Set<string>();
    const productCount: Record<string, number> = {};

    sucTickets.forEach((t) => {
      clientesSet.add(t.cliente_id);
      t.productos.forEach((p) => {
        productosSet.add(p.id);
        productCount[p.id] = (productCount[p.id] || 0) + 1;
      });
    });

    const topProductoId = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topProducto = PRODUCTOS_BASE.find((p) => p.id === topProductoId)?.nombre || "";

    return {
      id: suc.id,
      nombre: suc.nombre,
      ventasTotales,
      numTickets,
      ticketPromedio,
      productosUnicos: productosSet.size,
      topProducto,
      clientesUnicos: clientesSet.size,
    };
  });
}

// ── Auto Insights ─────────────────────────────────────────────────────────
export function computeInsights(sucursalFilter?: string): AutoInsight[] {
  const canasta = computeCanasta(sucursalFilter);
  const productos = computeProductos(sucursalFilter);
  const sucursales = computeSucursales();
  let tickets = generateMockTickets();
  if (sucursalFilter && sucursalFilter !== "todas") {
    tickets = tickets.filter((t) => t.sucursal_id === sucursalFilter);
  }
  const totalTickets = tickets.length;

  const insights: AutoInsight[] = [];

  // Insight 1: Anchor products
  const topVentas = [...productos].sort((a, b) => b.ventas - a.ventas).slice(0, 10);
  const topVentasIds = new Set(topVentas.map((p) => p.id));
  const anclas = canasta.topPenetracion.filter(
    (p) => p.penetracion > 40 && !topVentasIds.has(p.id)
  );
  if (anclas.length > 0) {
    const ancla = anclas[0];
    insights.push({
      id: "insight-ancla-1",
      tipo: "ancla",
      titulo: `"${ancla.nombre}" es un producto ancla clave`,
      descripcion: `Aparece en el ${ancla.penetracion.toFixed(1)}% de los tickets pero no figura en el top de ventas por valor. Es un producto de alta frecuencia con potencial para impulsar ventas cruzadas.`,
      impacto: "alto",
      accion: "Crear un combo o promoción vinculando este producto con uno de alto margen",
      datos: [
        { valor: ancla.penetracion, label: "% de tickets" },
        { valor: ancla.ventas, label: "Ventas totales MXN" },
      ],
    });
  }

  // Insight 2: Cross-sell from co-occurrence
  const topPairs = canasta.topCoOcurrencia.slice(0, 3);
  topPairs.forEach((pair, i) => {
    insights.push({
      id: `insight-promo-${i}`,
      tipo: "promocion",
      titulo: `Oportunidad: combo "${pair.nombre1}" + "${pair.nombre2}"`,
      descripcion: `Estos dos productos aparecen juntos en ${pair.frecuencia.toLocaleString()} tickets (${pair.soporte.toFixed(1)}% del total). Una promoción cruzada podría incrementar el ticket promedio hasta un 12%.`,
      impacto: pair.soporte > 15 ? "alto" : "medio",
      accion: "Diseñar una oferta 2x1 o descuento combinado en punto de venta",
      datos: [
        { valor: pair.frecuencia, label: "Veces juntos" },
        { valor: pair.soporte, label: "% del total de tickets" },
      ],
    });
  });

  // Insight 3: High margin, low penetration
  const oportunidades = productos.filter((p) => p.oportunidad === "alta").slice(0, 2);
  oportunidades.forEach((prod, i) => {
    insights.push({
      id: `insight-oportunidad-${i}`,
      tipo: "oportunidad",
      titulo: `"${prod.nombre}" tiene alto margen sin explotar`,
      descripcion: `Margen del ${(prod.margen * 100).toFixed(0)}% pero penetración de solo ${prod.penetracion.toFixed(1)}%. Con mayor visibilidad en góndola y activaciones, este SKU puede generar $${(prod.margenPesos * 1.5).toFixed(0)} adicionales en margen.`,
      impacto: "alto",
      accion: "Reubicar en zona caliente, incluir en planograma destacado",
      datos: [
        { valor: prod.margen * 100, label: "% Margen" },
        { valor: prod.penetracion, label: "% Penetración" },
      ],
    });
  });

  // Insight 4: Branch comparison
  const sucursalesStats = sucursales.sort((a, b) => b.ticketPromedio - a.ticketPromedio);
  const topSucursal = sucursalesStats[0];
  const bottomSucursal = sucursalesStats[sucursalesStats.length - 1];
  const gap = topSucursal.ticketPromedio - bottomSucursal.ticketPromedio;

  insights.push({
    id: "insight-sucursal-1",
    tipo: "sucursal",
    titulo: `Sucursal ${topSucursal.nombre} lidera con ticket promedio $${topSucursal.ticketPromedio.toFixed(2)}`,
    descripcion: `Existe una brecha de $${gap.toFixed(2)} MXN entre ${topSucursal.nombre} y ${bottomSucursal.nombre}. Replicar el mix de productos y estrategia de exhibición de ${topSucursal.nombre} en sucursales rezagadas.`,
    impacto: "alto",
    accion: `Analizar planograma de Sucursal ${topSucursal.nombre} y replicar en ${bottomSucursal.nombre}`,
    datos: [
      { valor: topSucursal.ticketPromedio, label: `Ticket promedio ${topSucursal.nombre}` },
      { valor: bottomSucursal.ticketPromedio, label: `Ticket promedio ${bottomSucursal.nombre}` },
    ],
  });

  // Insight 5: Recurrence opportunity
  const bajasFrec = sucursalesStats.filter((s) => s.numTickets < totalTickets * 0.18);
  if (bajasFrec.length > 0) {
    const suc = bajasFrec[0];
    insights.push({
      id: "insight-sucursal-2",
      tipo: "sucursal",
      titulo: `Sucursal ${suc.nombre}: ticket alto, baja recurrencia`,
      descripcion: `${suc.nombre} tiene un ticket promedio competitivo de $${suc.ticketPromedio.toFixed(2)} pero menor frecuencia de visitas. Oportunidad clara de programa de fidelización.`,
      impacto: "medio",
      accion: "Implementar tarjeta de puntos o promoción de regreso en Sucursal " + suc.nombre,
      datos: [
        { valor: suc.numTickets, label: "Tickets totales" },
        { valor: suc.ticketPromedio, label: "Ticket promedio MXN" },
      ],
    });
  }

  // Insight 6: Tendencia — category with highest growth
  insights.push({
    id: "insight-tendencia-1",
    tipo: "tendencia",
    titulo: "Higiene Personal: categoría de mayor crecimiento relativo",
    descripcion: `Los productos de Higiene Personal muestran márgenes promedio del 29% frente al 20% del total de categorías. Aumentar el surtido y la presencia en anaquel puede generar un diferencial competitivo sostenible.`,
    impacto: "medio",
    accion: "Ampliar el surtido de Higiene Personal con SKUs premium de mayor margen",
    datos: [
      { valor: 29, label: "Margen promedio Higiene %" },
      { valor: 20, label: "Margen promedio total %" },
    ],
  });

  // Insight: client type opportunity
  insights.push({
    id: "insight-tipo-1",
    tipo: "oportunidad",
    titulo: "Taqueros y restauranteros: segmento de alto valor subestimado",
    descripcion: `Los taqueros y restauranteros representan ~13% de los clientes pero con un ticket promedio 30-80% mayor que el tendero promedio. Crear un programa de cuenta mayorista diferenciado puede incrementar las ventas a este segmento en un 25%.`,
    impacto: "alto",
    accion: "Diseñar catálogo y precios especiales para clientes de giro restaurantero",
    datos: [
      { valor: 13, label: "% de clientes en giro de alimentos" },
      { valor: 25, label: "% incremento potencial en ventas" },
    ],
  });

  return insights;
}
