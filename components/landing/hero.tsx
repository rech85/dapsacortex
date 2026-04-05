import Link from "next/link"
import { Zap, ArrowRight, BarChart3, ShoppingBasket, Package, Users, Store, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-14">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
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
          DAPSA Cortex analiza tus 10,000+ tickets de venta mensuales y convierte ese ruido en insights claros: qué promover, qué reubicar, qué combinar y dónde está el margen sin explotar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Button
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
            asChild
          >
            <Link href="/login">
              Acceder al dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href="#features">Ver módulos</Link>
          </Button>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto max-w-4xl">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center gap-1.5 border-b border-slate-700 bg-slate-800 px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <div className="ml-3 flex-1 rounded-md bg-slate-700 px-3 py-0.5 text-xs text-slate-400">
                app.dapsa-cortex.mx/dashboard
              </div>
            </div>
            <div className="flex h-64 sm:h-80">
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
                  <div key={label} className="flex items-center gap-2 p-2 rounded-md text-slate-400 text-xs">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 bg-slate-900/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Ventas Totales", value: "$1.24M" },
                    { label: "Tickets", value: "10,000" },
                    { label: "Ticket Prom.", value: "$124.50" },
                    { label: "SKUs Activos", value: "50" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-lg border border-slate-700 bg-slate-800 p-2.5">
                      <p className="text-[9px] text-slate-400">{kpi.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 h-32 flex items-end gap-1">
                  {[30, 45, 38, 60, 52, 70, 55, 65, 80, 72, 68, 85, 75, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: `hsl(${210 + i * 3}, 80%, ${45 + i * 2}%)`,
                        opacity: 0.8,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
