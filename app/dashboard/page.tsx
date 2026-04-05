"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Store,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/ui/chart-card"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { OverviewStats } from "@/lib/analytics"

const SUCURSALES = [
  { id: "todas", nombre: "Todas las sucursales" },
  { id: "S001", nombre: "Juárez" },
  { id: "S002", nombre: "Montoya" },
  { id: "S003", nombre: "Saucito" },
  { id: "S004", nombre: "Moreno" },
  { id: "S005", nombre: "Salk" },
]

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-72 rounded-lg bg-muted" />
        <div className="h-72 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

const CATEGORY_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
]

export default function OverviewPage() {
  const [data, setData] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sucursal, setSucursal] = useState("todas")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/overview?sucursal=${sucursal}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [sucursal])

  if (loading) {
    return (
      <div>
        <Header
          title="Overview"
          subtitle="Vista general del desempeño comercial"
        />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!data) return null

  // Format dates for chart display
  const chartData = data.ticketsPorDia.map((d) => ({
    ...d,
    fechaCorta: d.fecha.slice(5), // MM-DD
    ventasK: Math.round(d.ventas / 1000),
  }))

  const catData = data.ventasPorCategoria.map((c, i) => ({
    ...c,
    ventasK: Math.round(c.ventas / 1000),
    fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }))

  return (
    <div>
      <Header
        title="Overview"
        subtitle="Vista general del desempeño comercial — últimos 90 días"
      />

      <div className="p-6 space-y-6">
        {/* Sucursal filter */}
        <div className="flex items-center gap-3">
          <Store className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium text-muted-foreground">
            Sucursal:
          </label>
          <select
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SUCURSALES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Ventas Totales"
            value={formatCurrency(data.ventasTotales)}
            subtitle="Suma de todos los tickets"
            trend={8.4}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Número de Tickets"
            value={formatNumber(data.numTickets)}
            subtitle="Transacciones registradas"
            trend={5.2}
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <StatCard
            title="Ticket Promedio"
            value={formatCurrency(data.ticketPromedio)}
            subtitle="Valor medio por compra"
            trend={2.9}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Productos Únicos"
            value={formatNumber(data.productosUnicos)}
            subtitle="SKUs con al menos 1 venta"
            icon={<Package className="h-5 w-5" />}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tickets per day */}
          <ChartCard
            title="Ventas Diarias (últimos 30 días)"
            description="Monto en miles de MXN"
            explanation="Esta línea muestra cómo evolucionan las ventas día a día en los últimos 30 días. Un patrón que suba hacia la derecha indica crecimiento. Las caídas entre semana son normales; lo importante es la tendencia general de los últimos 30 días comparada con el mes anterior."
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="fechaCorta"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "ventasK"
                      ? [`$${value}k MXN`, "Ventas"]
                      : [value, "Tickets"]
                  }
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend
                  formatter={(value) =>
                    value === "ventasK" ? "Ventas (miles MXN)" : "Tickets"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="ventasK"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  yAxisId={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Sales by category */}
          <ChartCard
            title="Ventas por Categoría"
            description="Miles de MXN por categoría de producto"
            explanation="Cada barra horizontal representa una categoría de productos. La longitud indica el total de ventas en pesos. Esta vista te dice dónde se concentra el dinero de los clientes, lo que ayuda a priorizar el surtido y las negociaciones con proveedores."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={catData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-muted"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}k`}
                />
                <YAxis
                  type="category"
                  dataKey="categoria"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value}k MXN`,
                    "Ventas",
                  ]}
                />
                <Bar dataKey="ventasK" radius={[0, 4, 4, 0]}>
                  {catData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category breakdown table */}
        <ChartCard
          title="Desglose por Categoría"
          description="Participación porcentual en ventas totales"
          explanation="Esta tabla muestra el peso relativo de cada categoría en las ventas totales. Las barras de progreso permiten comparar rápidamente qué categorías dominan. Úsala para identificar si el mix de categorías es equilibrado o si hay una dependencia excesiva en una sola familia de productos."
        >
          <div className="space-y-3">
            {data.ventasPorCategoria.map((cat, i) => (
              <div key={cat.categoria} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  }}
                />
                <span className="text-sm w-36 font-medium">{cat.categoria}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${cat.porcentaje}%`,
                      backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {cat.porcentaje.toFixed(1)}%
                </span>
                <span className="text-sm font-semibold w-28 text-right">
                  {formatCurrency(cat.ventas)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
