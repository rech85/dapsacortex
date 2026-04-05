import { BarChart3, ShoppingBasket, Package, Users, Store, Brain } from "lucide-react"

export function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden shadow-2xl shadow-black/50">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-slate-700 bg-slate-800 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <div className="ml-3 flex-1 rounded-md bg-slate-700 px-3 py-0.5 text-xs text-slate-400">
            app.dapsa-cortex.mx/dashboard
          </div>
        </div>
        {/* Content */}
        <div className="flex h-64 sm:h-80">
          {/* Sidebar mock */}
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
          {/* Main area mock */}
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
                  <p className="text-sm font-bold text-white mt-0.5">{kpi.value}</p>
                </div>
              ))}
            </div>
            {/* Fake bar chart */}
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
  )
}
