import {
  ShoppingBasket,
  Package,
  Users,
  Store,
  Brain,
  BarChart3,
} from "lucide-react"

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

export function SolutionSection() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Seis módulos. Una sola plataforma.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada módulo responde una pregunta comercial específica. Juntos, te dan una visión 360° de tu operación mayorista.
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
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
