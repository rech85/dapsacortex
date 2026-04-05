// lib/mock-data.ts
// NOTE: In production, this data will be fetched from DynamoDB via AWS Lambda

export const SUCURSALES = [
  { id: "S001", nombre: "Juárez", ciudad: "Chihuahua" },
  { id: "S002", nombre: "Montoya", ciudad: "Chihuahua" },
  { id: "S003", nombre: "Saucito", ciudad: "Chihuahua" },
  { id: "S004", nombre: "Moreno", ciudad: "Chihuahua" },
  { id: "S005", nombre: "Salk", ciudad: "Chihuahua" },
];

export const CATEGORIAS = [
  "Abarrotes",
  "Lácteos",
  "Bebidas",
  "Limpieza",
  "Higiene Personal",
  "Botanas",
  "Carnes",
  "Panadería",
];

export const PRODUCTOS_BASE = [
  // Abarrotes
  { id: "P001", nombre: "Arroz Morelos 1kg", precio: 28.5, categoria: "Abarrotes", margen: 0.18 },
  { id: "P002", nombre: "Frijol Negro 1kg", precio: 32.0, categoria: "Abarrotes", margen: 0.20 },
  { id: "P003", nombre: "Aceite Capullo 1L", precio: 48.0, categoria: "Abarrotes", margen: 0.15 },
  { id: "P004", nombre: "Azúcar Estándar 1kg", precio: 24.0, categoria: "Abarrotes", margen: 0.12 },
  { id: "P005", nombre: "Sal de Mesa 1kg", precio: 12.0, categoria: "Abarrotes", margen: 0.22 },
  { id: "P006", nombre: "Harina Tortillera 1kg", precio: 18.0, categoria: "Abarrotes", margen: 0.16 },
  { id: "P007", nombre: "Pasta Espagueti 500g", precio: 16.5, categoria: "Abarrotes", margen: 0.19 },
  { id: "P008", nombre: "Atún en Lata 140g", precio: 22.0, categoria: "Abarrotes", margen: 0.25 },
  // Lácteos
  { id: "P009", nombre: "Leche Lala 1L", precio: 26.0, categoria: "Lácteos", margen: 0.10 },
  { id: "P010", nombre: "Queso Panela 400g", precio: 68.0, categoria: "Lácteos", margen: 0.22 },
  { id: "P011", nombre: "Yogur Yoplait 900g", precio: 55.0, categoria: "Lácteos", margen: 0.18 },
  { id: "P012", nombre: "Crema Alpura 500ml", precio: 42.0, categoria: "Lácteos", margen: 0.20 },
  // Bebidas
  { id: "P013", nombre: "Coca-Cola 2L", precio: 38.0, categoria: "Bebidas", margen: 0.12 },
  { id: "P014", nombre: "Agua Ciel 1.5L", precio: 16.0, categoria: "Bebidas", margen: 0.28 },
  { id: "P015", nombre: "Jugo Del Valle 1L", precio: 32.0, categoria: "Bebidas", margen: 0.20 },
  { id: "P016", nombre: "Jarritos Tamarindo 600ml", precio: 18.0, categoria: "Bebidas", margen: 0.22 },
  { id: "P017", nombre: "Café Nescafé 200g", precio: 85.0, categoria: "Bebidas", margen: 0.30 },
  // Limpieza
  { id: "P018", nombre: "Detergente Ariel 1kg", precio: 78.0, categoria: "Limpieza", margen: 0.18 },
  { id: "P019", nombre: "Pinol Pino 900ml", precio: 35.0, categoria: "Limpieza", margen: 0.25 },
  { id: "P020", nombre: "Fabuloso 1L", precio: 28.0, categoria: "Limpieza", margen: 0.22 },
  { id: "P021", nombre: "Cloralex 2L", precio: 32.0, categoria: "Limpieza", margen: 0.20 },
  { id: "P022", nombre: "Axion Lavatrastes 500g", precio: 42.0, categoria: "Limpieza", margen: 0.24 },
  // Higiene
  { id: "P023", nombre: "Jabón Dove 90g", precio: 28.0, categoria: "Higiene Personal", margen: 0.30 },
  { id: "P024", nombre: "Shampoo Head&Shoulders 400ml", precio: 95.0, categoria: "Higiene Personal", margen: 0.28 },
  { id: "P025", nombre: "Papel Higiénico Petalo 4-pack", precio: 48.0, categoria: "Higiene Personal", margen: 0.22 },
  { id: "P026", nombre: "Pasta Dental Colgate 100ml", precio: 38.0, categoria: "Higiene Personal", margen: 0.32 },
  { id: "P027", nombre: "Desodorante Axe 150ml", precio: 65.0, categoria: "Higiene Personal", margen: 0.35 },
  // Botanas
  { id: "P028", nombre: "Sabritas Original 45g", precio: 18.0, categoria: "Botanas", margen: 0.35 },
  { id: "P029", nombre: "Doritos Nacho 65g", precio: 22.0, categoria: "Botanas", margen: 0.32 },
  { id: "P030", nombre: "Cheetos Flamin Hot 80g", precio: 24.0, categoria: "Botanas", margen: 0.30 },
  { id: "P031", nombre: "Galletas Marias 200g", precio: 28.0, categoria: "Botanas", margen: 0.25 },
  { id: "P032", nombre: "Palomitas Totis 60g", precio: 16.0, categoria: "Botanas", margen: 0.38 },
  // Carnes
  { id: "P033", nombre: "Jamón de Pavo 200g", precio: 55.0, categoria: "Carnes", margen: 0.20 },
  { id: "P034", nombre: "Salchicha Fud 500g", precio: 75.0, categoria: "Carnes", margen: 0.18 },
  { id: "P035", nombre: "Chorizo Extra 250g", precio: 65.0, categoria: "Carnes", margen: 0.22 },
  // Panadería
  { id: "P036", nombre: "Pan Bimbo Grande 680g", precio: 62.0, categoria: "Panadería", margen: 0.15 },
  { id: "P037", nombre: "Pan Tostado Bimbo 460g", precio: 48.0, categoria: "Panadería", margen: 0.18 },
  // More products
  { id: "P038", nombre: "Sopas Maruchan x3", precio: 30.0, categoria: "Abarrotes", margen: 0.28 },
  { id: "P039", nombre: "Mayonesa Hellmanns 400g", precio: 58.0, categoria: "Abarrotes", margen: 0.22 },
  { id: "P040", nombre: "Salsa Valentina 370ml", precio: 32.0, categoria: "Abarrotes", margen: 0.30 },
  { id: "P041", nombre: "Sardina Cibeles 425g", precio: 38.0, categoria: "Abarrotes", margen: 0.26 },
  { id: "P042", nombre: "Servilletas Kleenex 100pk", precio: 35.0, categoria: "Higiene Personal", margen: 0.28 },
  { id: "P043", nombre: "Suavitel Toque 1L", precio: 52.0, categoria: "Limpieza", margen: 0.20 },
  { id: "P044", nombre: "Nestlé Nido 400g", precio: 120.0, categoria: "Lácteos", margen: 0.25 },
  { id: "P045", nombre: "Milo 400g", precio: 98.0, categoria: "Bebidas", margen: 0.28 },
  { id: "P046", nombre: "Ketchup Heinz 397g", precio: 65.0, categoria: "Abarrotes", margen: 0.24 },
  { id: "P047", nombre: "Mostaza French's 255g", precio: 42.0, categoria: "Abarrotes", margen: 0.26 },
  { id: "P048", nombre: "Cereal Zucaritas 500g", precio: 88.0, categoria: "Abarrotes", margen: 0.22 },
  { id: "P049", nombre: "Avena Quaker 500g", precio: 45.0, categoria: "Abarrotes", margen: 0.24 },
  { id: "P050", nombre: "Té Lipton 25 sobres", precio: 38.0, categoria: "Bebidas", margen: 0.32 },
];

export interface ProductoTicket {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  cantidad: number;
}

export interface Ticket {
  ticket_id: string;
  sucursal_id: string;
  sucursal_nombre: string;
  fecha: string;
  cliente_id: string;
  tipo_cliente: "tendero" | "taquero" | "ama_de_casa" | "restaurantero";
  productos: ProductoTicket[];
  total: number;
}

export const TIPOS_CLIENTE = [
  {
    id: "tendero" as const,
    nombre: "Tendero",
    descripcion: "Propietario de tienda de abarrotes o miscelánea",
    porcentaje: 80,
    color: "#3b82f6",
    emoji: "🏪",
    estrategia: "Ofrecer crédito de confianza, descuentos por volumen, surtido completo de básicos y entrega programada semanal.",
    productosPreferidos: ["P001","P002","P003","P004","P005","P006","P007","P008","P038","P013"],
  },
  {
    id: "taquero" as const,
    nombre: "Taquero",
    descripcion: "Operador de taquería, puesto de comida o cocina económica",
    porcentaje: 8,
    color: "#f59e0b",
    emoji: "🌮",
    estrategia: "Vender combos de insumos para cocina (aceite+sal+harina+salsas), ofrecer precios por caja/bulto, servicio de surtido temprano (5-7am).",
    productosPreferidos: ["P003","P005","P006","P033","P034","P035","P040","P039","P042","P020"],
  },
  {
    id: "ama_de_casa" as const,
    nombre: "Ama de Casa",
    descripcion: "Compras del hogar y la familia",
    porcentaje: 7,
    color: "#10b981",
    emoji: "🏠",
    estrategia: "Promociones semanales en categorías de higiene y lácteos, combos de limpieza del hogar, programa de puntos por lealtad.",
    productosPreferidos: ["P009","P010","P023","P025","P026","P018","P020","P036","P048","P011"],
  },
  {
    id: "restaurantero" as const,
    nombre: "Restaurantero",
    descripcion: "Dueño o encargado de restaurante o fonda",
    porcentaje: 5,
    color: "#8b5cf6",
    emoji: "🍽️",
    estrategia: "Cuenta corporativa con crédito a 30 días, descuentos en insumos clave (arroz, aceite, carnes), asesoría en costos de receta.",
    productosPreferidos: ["P001","P002","P003","P004","P005","P007","P033","P034","P039","P046"],
  },
];

// Seeded random for consistent data
function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Product affinities: these products tend to appear together
const AFFINIDADES: [string, string, number][] = [
  ["P001", "P002", 0.65], // Arroz + Frijol
  ["P009", "P036", 0.55], // Leche + Pan
  ["P013", "P028", 0.50], // Coca-Cola + Sabritas
  ["P013", "P029", 0.45], // Coca-Cola + Doritos
  ["P018", "P020", 0.40], // Ariel + Fabuloso
  ["P023", "P025", 0.48], // Jabón + Papel higiénico
  ["P026", "P023", 0.42], // Pasta dental + Jabón
  ["P001", "P003", 0.38], // Arroz + Aceite
  ["P036", "P009", 0.60], // Pan + Leche
  ["P033", "P036", 0.55], // Jamón + Pan
  ["P005", "P003", 0.55], // Sal + Aceite (taqueros)
  ["P006", "P040", 0.50], // Harina + Salsa Valentina (taqueros)
  ["P033", "P006", 0.45], // Jamón + Harina
];

let cachedTickets: Ticket[] | null = null;

export function generateMockTickets(): Ticket[] {
  if (cachedTickets) return cachedTickets;

  const rand = seededRandom(42);
  const tickets: Ticket[] = [];

  // Distribution weights per branch (some branches are busier)
  const sucursalWeights = [0.25, 0.22, 0.20, 0.18, 0.15];

  // Date range: last 90 days from a fixed reference
  const baseDate = new Date("2025-12-31");

  function getTipoCliente(clienteIdStr: string): Ticket["tipo_cliente"] {
    const num = parseInt(clienteIdStr.slice(1)); // "C00123" -> 123
    const r = num % 100;
    if (r < 80) return "tendero";
    if (r < 88) return "taquero";
    if (r < 95) return "ama_de_casa";
    return "restaurantero";
  }

  for (let i = 0; i < 10000; i++) {
    // Pick branch based on weights
    let sucursalIdx = 0;
    const r = rand();
    let cumWeight = 0;
    for (let j = 0; j < sucursalWeights.length; j++) {
      cumWeight += sucursalWeights[j];
      if (r < cumWeight) {
        sucursalIdx = j;
        break;
      }
    }

    const sucursal = SUCURSALES[sucursalIdx];

    // Random date in last 90 days
    const daysAgo = Math.floor(rand() * 90);
    const fecha = new Date(baseDate);
    fecha.setDate(fecha.getDate() - daysAgo);
    const fechaStr = fecha.toISOString().split("T")[0];

    // Random client (some clients repeat — 60% of tickets from recurring clients)
    const clientePool = 3000; // pool of 3000 clients
    const isRecurring = rand() < 0.6;
    const clienteBase = isRecurring
      ? Math.floor(rand() * 800)  // 800 frequent clients
      : Math.floor(rand() * clientePool);
    const cliente_id = `C${String(clienteBase).padStart(5, "0")}`;

    // Build basket: 2-8 products
    const numProductos = Math.floor(rand() * 7) + 2;
    const selectedProducts: Set<string> = new Set();
    const productosTicket: ProductoTicket[] = [];

    // First pick a "anchor" product
    const anchorIdx = Math.floor(rand() * PRODUCTOS_BASE.length);
    const anchor = PRODUCTOS_BASE[anchorIdx];
    selectedProducts.add(anchor.id);
    productosTicket.push({
      ...anchor,
      cantidad: Math.floor(rand() * 3) + 1,
    });

    // Then add products based on affinities or random
    let attempts = 0;
    while (productosTicket.length < numProductos && attempts < 30) {
      attempts++;
      // Check affinity first
      let added = false;
      for (const [p1, p2, prob] of AFFINIDADES) {
        if (
          selectedProducts.has(p1) &&
          !selectedProducts.has(p2) &&
          rand() < prob
        ) {
          const prod = PRODUCTOS_BASE.find((p) => p.id === p2);
          if (prod) {
            selectedProducts.add(p2);
            productosTicket.push({ ...prod, cantidad: 1 });
            added = true;
            break;
          }
        }
        if (
          selectedProducts.has(p2) &&
          !selectedProducts.has(p1) &&
          rand() < prob
        ) {
          const prod = PRODUCTOS_BASE.find((p) => p.id === p1);
          if (prod) {
            selectedProducts.add(p1);
            productosTicket.push({ ...prod, cantidad: 1 });
            added = true;
            break;
          }
        }
      }
      if (!added) {
        // Random product
        const randomIdx = Math.floor(rand() * PRODUCTOS_BASE.length);
        const prod = PRODUCTOS_BASE[randomIdx];
        if (!selectedProducts.has(prod.id)) {
          selectedProducts.add(prod.id);
          productosTicket.push({
            ...prod,
            cantidad: Math.floor(rand() * 2) + 1,
          });
        }
      }
    }

    const total = productosTicket.reduce(
      (sum, p) => sum + p.precio * p.cantidad,
      0
    );

    tickets.push({
      ticket_id: `T${String(i + 1).padStart(6, "0")}`,
      sucursal_id: sucursal.id,
      sucursal_nombre: sucursal.nombre,
      fecha: fechaStr,
      cliente_id,
      tipo_cliente: getTipoCliente(cliente_id),
      productos: productosTicket,
      total,
    });
  }

  cachedTickets = tickets;
  return tickets;
}
