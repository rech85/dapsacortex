import Link from "next/link"
import {
  Zap,
  BarChart3,
  ShoppingBasket,
  Users,
  Store,
  Brain,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Package,
  ChevronRight,
  Database,
  Clock,
  FileText,
  Wifi,
  RefreshCw,
  Radio,
  Shield,
  Check,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const FEATURES = [
  {
    icon: ShoppingBasket,
    title: "Inteligencia de Canasta",
    desc: "Descubre qué productos se compran juntos, penetración por SKU y oportunidades de cross-sell respaldadas por datos.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Package,
    title: "Inteligencia de Producto",
    desc: "Mapa de margen vs penetración para cada SKU. Identifica los productos de alto margen que nadie está comprando todavía.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Segmentación de Clientes",
    desc: "Segmenta automáticamente en Frecuentes, Ocasionales y Nuevos. Entiende el valor real de cada segmento y actúa en consecuencia.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Store,
    title: "Comparativa por Sucursal",
    desc: "Benchmark entre tus 5 sucursales en tiempo real. Identifica las brechas de ticket promedio y replica las mejores prácticas.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Brain,
    title: "Insights Automáticos",
    desc: "El sistema genera recomendaciones accionables clasificadas por impacto: promociones, combos, reubicación de góndola y más.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: BarChart3,
    title: "Dashboard Ejecutivo",
    desc: "KPIs en tiempo real: ventas totales, ticket promedio, tendencia diaria y desglose por categoría con un solo clic.",
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
]

const PROBLEMS = [
  {
    icon: AlertCircle,
    text: "Tienes 10,000 tickets mensuales pero no sabes cuáles productos anclan la canasta",
  },
  {
    icon: AlertCircle,
    text: "Cada sucursal funciona de manera diferente pero no tienes con qué comparar",
  },
  {
    icon: AlertCircle,
    text: "Algunos productos tienen margen del 35% y penetración del 5% — nadie lo sabe",
  },
  {
    icon: AlertCircle,
    text: "Las decisiones de compra, exhibición y promoción se toman sin datos",
  },
]

const BENEFITS = [
  "Incrementa el ticket promedio identificando combos naturales",
  "Reduce merma reordenando productos según demanda real",
  "Aumenta la retención convirtiendo clientes ocasionales en frecuentes",
  "Optimiza el planograma con datos de penetración por góndola",
  "Toma decisiones de compra basadas en margen real, no en intuición",
  "Benchmark continuo entre sucursales para replicar mejores prácticas",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-white/90 backdrop-blur-sm px-6 sm:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">DAPSA Cortex</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar sesión
          </Link>
          <Button size="sm" asChild>
            <Link href="/login">Ver demo</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-14">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8">
            <Zap className="h-3.5 w-3.5" />
            <span>Inteligencia Comercial para Distribuidoras Mayoristas</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Convierte cada ticket
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              en una decisión estratégica
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-300 mb-10 leading-relaxed">
            DAPSA Cortex analiza tus 10,000+ tickets de venta mensuales y convierte ese
            ruido en insights claros: qué promover, qué reubicar, qué combinar y dónde
            está el margen sin explotar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25" asChild>
              <Link href="/login">
                Acceder al dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" asChild>
              <Link href="#features">Ver módulos</Link>
            </Button>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden shadow-2xl shadow-black/50">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-slate-700 bg-slate-800 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <div className="ml-3 flex-1 rounded-md bg-slate-700 px-3 py-0.5 text-xs text-slate-400">
                  app.dapsa-cortex.mx/dashboard
                </div>
              </div>
              {/* Dashboard preview content */}
              <div className="flex h-64 sm:h-80">
                {/* Sidebar */}
                <div className="hidden sm:flex w-44 flex-col border-r border-slate-700 bg-slate-900 p-3 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-md bg-blue-600 text-white text-xs font-medium">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Overview
                  </div>
                  {[
                    { icon: ShoppingBasket, label: "Canasta" },
                    { icon: Package, label: "Productos" },
                    { icon: Users, label: "Clientes" },
                    { icon: Store, label: "Sucursales" },
                    { icon: Brain, label: "Insights" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 p-2 rounded-md text-slate-400 text-xs"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  ))}
                </div>
                {/* Main content mock */}
                <div className="flex-1 p-4 bg-slate-900/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Ventas Totales", value: "$1.24M" },
                      { label: "Tickets", value: "10,000" },
                      { label: "Ticket Prom.", value: "$124.50" },
                      { label: "SKUs Activos", value: "50" },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-lg border border-slate-700 bg-slate-800 p-2.5"
                      >
                        <p className="text-[9px] text-slate-400">{kpi.label}</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {kpi.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Fake chart bars */}
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 h-32 flex items-end gap-1">
                    {[30, 45, 38, 60, 52, 70, 55, 65, 80, 72, 68, 85, 75, 90].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            backgroundColor: `hsl(${210 + i * 3}, 80%, ${45 + i * 2}%)`,
                            opacity: 0.8,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-3/4 bg-blue-500/10 blur-xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              El problema que conocemos bien
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tienes los datos. Miles de tickets al mes. Pero están atrapados en
              Excel, en el sistema de punto de venta o simplemente no los estás
              analizando.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <p.icon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-blue-600 p-6 text-white text-center">
            <p className="text-lg font-semibold mb-2">
              El resultado: decisiones basadas en intuición, no en datos
            </p>
            <p className="text-blue-100 text-sm">
              Mientras tus competidores optimizan con datos, tú sigues decidiendo
              qué comprar, qué promover y cómo acomodar la góndola por experiencia
              personal. DAPSA Cortex cierra esa brecha.
            </p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Seis módulos. Una sola plataforma.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada módulo responde una pregunta comercial específica. Juntos,
              te dan una visión 360° de tu operación mayorista.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex rounded-lg p-2.5 mb-4 ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 px-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Resultados desde el primer mes
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto">
              Nuestros clientes reportan mejoras concretas en ticket promedio,
              margen y retención de clientes en las primeras 4 semanas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-200 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-50">{b}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Conectamos con tu sistema de punto de venta y en 48 horas tienes
              el primer dashboard operativo.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Conecta tus datos",
                desc: "Exporta tus tickets en cualquier formato (CSV, Excel, API). Nuestro equipo configura el pipeline de datos en 48 horas.",
                color: "text-blue-600",
                border: "border-blue-200",
              },
              {
                step: "02",
                title: "El sistema analiza",
                desc: "Procesamos 10,000+ tickets para calcular penetración, co-ocurrencia, segmentación de clientes y detección de oportunidades.",
                color: "text-purple-600",
                border: "border-purple-200",
              },
              {
                step: "03",
                title: "Tú decides y actúas",
                desc: "Recibes insights priorizados por impacto económico. Cada recomendación incluye una acción concreta que puedes implementar hoy.",
                color: "text-green-600",
                border: "border-green-200",
              },
            ].map((s) => (
              <div
                key={s.step}
                className={`rounded-xl border-2 ${s.border} p-6 text-center`}
              >
                <div
                  className={`text-4xl font-black ${s.color} mb-4 opacity-30`}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POS DATA REQUIREMENTS SECTION ──────────────────────────────── */}
      <section id="integracion" className="py-20 px-6 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-4">
              <Database className="h-3.5 w-3.5" />
              <span>Para la propuesta de integración</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              ¿Qué datos necesitamos del sistema POS?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              La integración es más sencilla de lo que parece. Si tu sistema POS
              genera tickets de venta, ya tenemos el 80% de lo que necesitamos.
              Aquí están los campos exactos y la frecuencia recomendada para la propuesta.
            </p>
          </div>

          {/* Data fields table */}
          <div className="mb-12 rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-slate-50 px-6 py-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-sm">Estructura del ticket requerida</h3>
              <span className="ml-auto text-xs text-muted-foreground">Un registro por línea de producto vendido</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left py-3 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Campo</th>
                    <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Ejemplo</th>
                    <th className="text-center py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Requerido</th>
                    <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide">Módulo que lo usa</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { campo: "ticket_id / folio", desc: "Identificador único de la transacción", ejemplo: "T-00123456", req: true, modulo: "Todos" },
                    { campo: "fecha_hora", desc: "Timestamp exacto de la venta", ejemplo: "2025-10-15 14:32:07", req: true, modulo: "Overview, Tendencias" },
                    { campo: "sucursal_id", desc: "Código o nombre de la tienda", ejemplo: "S001 / Juárez", req: true, modulo: "Sucursales, Overview" },
                    { campo: "sku / codigo_producto", desc: "Identificador único del artículo", ejemplo: "P001 / 7501234567890", req: true, modulo: "Canasta, Producto" },
                    { campo: "nombre_producto", desc: "Descripción legible del artículo", ejemplo: "Arroz Morelos 1kg", req: true, modulo: "Todos" },
                    { campo: "cantidad", desc: "Unidades vendidas en la línea", ejemplo: "3", req: true, modulo: "Producto, Canasta" },
                    { campo: "precio_unitario", desc: "Precio de venta al momento de la transacción", ejemplo: "$28.50", req: true, modulo: "Todos" },
                    { campo: "categoria", desc: "Familia o categoría del producto", ejemplo: "Abarrotes, Lácteos", req: false, modulo: "Overview, Producto" },
                    { campo: "cliente_id", desc: "Número de cliente si el POS lo captura", ejemplo: "C-00341", req: false, modulo: "Clientes, Fidelización" },
                    { campo: "tipo_cliente", desc: "Giro del negocio del comprador (tendero, taquero…)", ejemplo: "Tendero", req: false, modulo: "Inteligencia de Cliente" },
                    { campo: "descuento", desc: "Descuento aplicado en la línea (MXN o %)", ejemplo: "$2.00", req: false, modulo: "Márgenes, Promociones" },
                    { campo: "tipo_pago", desc: "Forma de pago de la transacción", ejemplo: "Efectivo / Tarjeta", req: false, modulo: "Flujo de caja" },
                    { campo: "vendedor_id", desc: "Cajero o vendedor que atendió", ejemplo: "V-007", req: false, modulo: "Productividad" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-6 font-mono text-xs font-semibold text-slate-700">{row.campo}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{row.desc}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{row.ejemplo}</td>
                      <td className="py-3 px-4 text-center">
                        {row.req ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-semibold">
                            <Check className="h-3 w-3" />Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-xs">
                            <Minus className="h-3 w-3" />Opcional
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{row.modulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t bg-amber-50 px-6 py-3 flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Nota de privacidad:</strong> Los campos de cliente_id y tipo_cliente se manejan con seudoanonimización.
                No se requieren datos personales (nombre, teléfono, dirección). Solo identificadores internos del POS.
              </p>
            </div>
          </div>

          {/* Frequency / Integration tiers */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-slate-600" />
              <h3 className="text-xl font-bold">Frecuencia de extracción — 2 fases de integración</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Fase 1 */}
              <div className="rounded-xl border-2 border-blue-200 bg-white p-6 relative">
                <div className="absolute -top-3 left-4 rounded-full bg-blue-600 text-white text-xs font-bold px-3 py-1">
                  Fase 1 — Inicio
                </div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Lote Diario</p>
                    <p className="text-xs text-muted-foreground">Batch nocturno</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    "Extracción automática cada noche (23:00 hrs)",
                    "Archivo CSV, Excel o JSON con ventas del día",
                    "Dashboard actualizado cada mañana",
                    "Compatible con cualquier sistema POS",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-0.5">Tiempo de implementación</p>
                  <p className="text-lg font-black text-blue-800">~4 semanas</p>
                  <p className="text-xs text-blue-600">Sin modificar el sistema POS</p>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <strong className="text-slate-700">Mecanismo:</strong> FTP/SFTP, carpeta compartida, correo automático, exportación programada del POS
                </div>
              </div>

              {/* Fase 2 */}
              <div className="rounded-xl border-2 border-purple-200 bg-white p-6 relative">
                <div className="absolute -top-3 left-4 rounded-full bg-purple-600 text-white text-xs font-bold px-3 py-1">
                  Fase 2 — Escala
                </div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="rounded-lg bg-purple-50 p-2">
                    <Wifi className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Near Real-Time</p>
                    <p className="text-xs text-muted-foreground">Cada hora vía API</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    "Sincronización cada 60 minutos",
                    "API REST o webhook del POS hacia AWS",
                    "Dashboard con lag máximo de 1 hora",
                    "Alertas automáticas por anomalías",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs font-semibold text-purple-700 mb-0.5">Tiempo de implementación</p>
                  <p className="text-lg font-black text-purple-800">~6 semanas</p>
                  <p className="text-xs text-purple-600">Requiere API en el POS</p>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <strong className="text-slate-700">Mecanismo:</strong> API Gateway → AWS Lambda → DynamoDB. Compatible con SAP, Microsip, Aspel, SoftRestaurant
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Listo para verlo en acción
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Accede al dashboard demo ahora mismo. Datos reales de una distribuidora
            mayorista simulada con 10,000 tickets, 50 productos y 5 sucursales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-lg shadow-blue-500/20"
              asChild
            >
              <Link href="/login">
                <Zap className="h-4 w-4" />
                Acceder al demo
              </Link>
            </Button>
            <p className="text-sm text-slate-500">
              No requiere registro. Credenciales: demo@dapsa.mx / demo2025
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {[
              "10,000 tickets analizados",
              "5 sucursales",
              "50 SKUs",
              "6 módulos de análisis",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-blue-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 bg-slate-950">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-700">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">DAPSA Cortex</span>
          </div>
          <p className="text-xs text-slate-500">
            MVP — Inteligencia Comercial para Grupo Dapsa © 2025
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              Dashboard
              <TrendingUp className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
