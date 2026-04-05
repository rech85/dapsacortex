import { CheckCircle2 } from "lucide-react"

const BENEFITS = [
  "Incrementa el ticket promedio identificando combos naturales",
  "Reduce merma reordenando productos según demanda real",
  "Aumenta la retención convirtiendo clientes ocasionales en frecuentes",
  "Optimiza el planograma con datos de penetración por góndola",
  "Toma decisiones de compra basadas en margen real, no en intuición",
  "Benchmark continuo entre sucursales para replicar mejores prácticas",
]

const METRICS = [
  { value: "+12%", label: "Incremento en ticket promedio" },
  { value: "+18%", label: "Aumento en margen total" },
  { value: "2 sem.", label: "Tiempo promedio de onboarding" },
]

export function BenefitsSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 px-6 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Resultados desde el primer mes</h2>
          <p className="text-blue-100 max-w-xl mx-auto">
            Nuestros clientes reportan mejoras concretas en ticket promedio, margen y retención de clientes en las primeras 4 semanas.
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
        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-blue-500 pt-10">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-3xl font-bold text-white">{m.value}</p>
              <p className="text-sm text-blue-200 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
