import { AlertCircle } from "lucide-react"

const PROBLEMS = [
  {
    text: "Tienes 10,000 tickets mensuales pero no sabes cuáles productos anclan la canasta",
  },
  {
    text: "Cada sucursal funciona de manera diferente pero no tienes con qué comparar",
  },
  {
    text: "Algunos productos tienen margen del 35% y penetración del 5% — nadie lo sabe",
  },
  {
    text: "Las decisiones de compra, exhibición y promoción se toman sin datos",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">El problema que conocemos bien</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tienes los datos. Miles de tickets al mes. Pero están atrapados en Excel, en el sistema de punto de venta o simplemente no los estás analizando.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg bg-blue-600 p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">
            El resultado: decisiones basadas en intuición, no en datos
          </p>
          <p className="text-blue-100 text-sm">
            Mientras tus competidores optimizan con datos, tú sigues decidiendo qué comprar, qué promover y cómo acomodar la góndola por experiencia personal. DAPSA Cortex cierra esa brecha.
          </p>
        </div>
      </div>
    </section>
  )
}
