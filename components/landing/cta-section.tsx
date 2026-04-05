import Link from "next/link"
import { Zap, TrendingUp, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
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
          Accede al dashboard demo ahora mismo. Datos reales de una distribuidora mayorista simulada con 10,000 tickets, 50 productos y 5 sucursales.
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
  )
}
