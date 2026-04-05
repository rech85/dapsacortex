"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Cell,
} from "recharts"
import {
  Store,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { ChartCard } from "@/components/ui/chart-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { SucursalStats } from "@/lib/analytics"

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-72 rounded-lg bg-muted" />
        <div className="h-72 rounded-lg bg-muted" />
      </div>
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  )
}

const SUC_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
]

export default function SucursalesPage() {
  const [data, setData] = useState<SucursalStats[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sucursales")
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div>
        <Header
          title="Inteligencia por Sucursal"
          subtitle="Comparativa de desempeño entre las 5 sucursales"
        />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!data) return null

  const sorted = [...data].sort((a, b) => b.ventasTotales - a.ventasTotales)
  const topSucursal = sorted[0]
  const bottomSucursal = sorted[sorted.length - 1]

  const ventasData = data.map((s, i) => ({
    nombre: s.nombre,
    ventasK: Math.round(s.ventasTotales / 1000),
    ticketPromedio: parseFloat(s.ticketPromedio.toFixed(2)),
    numTickets: s.numTickets,
    fill: SUC_COLORS[i],
  }))

  const clientesData = data.map((s, i) => ({
    nombre: s.nombre,
    clientesUnicos: s.clientesUnicos,
    productosUnicos: s.productosUnicos,
    fill: SUC_COLORS[i],
  }))

  // Normalize for radar chart (each metric as % of max)
  const maxVentas = Math.max(...data.map((s) => s.ventasTotales))
  const maxTickets = Math.max(...data.map((s) => s.numTickets))
  const maxTicketProm = Math.max(...data.map((s) => s.ticketPromedio))
  const maxClientes = Math.max(...data.map((s) => s.clientesUnicos))
  const maxProductos = Math.max(...data.map((s) => s.productosUnicos))

  const radarData = [
    {
      metric: "Ventas totales",
      ...Object.fromEntries(
        data.map((s) => [s.nombre, Math.round((s.ventasTotales / maxVentas) * 100)])
      ),
    },
    {
      metric: "Núm. tickets",
      ...Object.fromEntries(
        data.map((s) => [s.nombre, Math.round((s.numTickets / maxTickets) * 100)])
      ),
    },
    {
      metric: "Ticket promedio",
      ...Object.fromEntries(
        data.map((s) => [
          s.nombre,
          Math.round((s.ticketPromedio / maxTicketProm) * 100),
        ])
      ),
    },
    {
      metric: "Clientes únicos",
      ...Object.fromEntries(
        data.map((s) => [
          s.nombre,
          Math.round((s.clientesUnicos / maxClientes) * 100),
        ])
      ),
    },
    {
      metric: "SKUs únicos",
      ...Object.fromEntries(
        data.map((s) => [
          s.nombre,
          Math.round((s.productosUnicos / maxProductos) * 100),
        ])
      ),
    },
  ]

  return (
    <div>
      <Header
        title="Inteligencia por Sucursal"
        subtitle="Comparativa de desempeño entre las 5 sucursales — últimos 90 días"
      />

      <div className="p-6 space-y-6">
        {/* Branch ranking cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sorted.map((suc, i) => (
            <Card
              key={suc.id}
              className="relative overflow-hidden border-l-4"
              style={{ borderLeftColor: SUC_COLORS[data.findIndex((d) => d.id === suc.id)] }}
            >
              <CardContent className="p-4">
                {i === 0 && (
                  <Award className="absolute top-3 right-3 h-4 w-4 text-amber-400" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Store
                    className="h-4 w-4"
                    style={{
                      color: SUC_COLORS[data.findIndex((d) => d.id === suc.id)],
                    }}
                  />
                  <span className="font-bold text-sm">{suc.nombre}</span>
                </div>
                <p className="text-lg font-bold">
                  {formatCurrency(suc.ventasTotales)}
                </p>
                <p className="text-xs text-muted-foreground">ventas totales</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tickets</span>
                    <span className="font-medium">
                      {formatNumber(suc.numTickets)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tkt. prom.</span>
                    <span className="font-medium">
                      {formatCurrency(suc.ticketPromedio)}
                    </span>
                  </div>
                </div>
                <Badge
                  className="mt-2 text-[10px]"
                  variant={i === 0 ? "default" : "secondary"}
                >
                  #{i + 1} ranking
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert: gap between top and bottom */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                Brecha de desempeño detectada
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                <strong>Sucursal {topSucursal.nombre}</strong> lidera con ventas{" "}
                {(
                  (topSucursal.ventasTotales / bottomSucursal.ventasTotales - 1) *
                  100
                ).toFixed(0)}
                % mayores que <strong>Sucursal {bottomSucursal.nombre}</strong>.
                La brecha de ticket promedio es{" "}
                {formatCurrency(
                  topSucursal.ticketPromedio - bottomSucursal.ticketPromedio
                )}
                . Replicar el mix de productos y estrategia de exhibición puede
                reducir esta brecha.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Ventas comparison */}
          <ChartCard
            title="Ventas Totales por Sucursal"
            description="Miles de MXN — ticket promedio superpuesto"
            explanation="Esta gráfica compara las sucursales en las métricas más importantes de negocio. La altura de las barras permite identificar rápidamente cuál sucursal es líder y cuál tiene más área de oportunidad. Si una sucursal tiene muchos tickets pero bajo ticket promedio, significa que sus clientes compran poco en cada visita y hay oportunidad de venta cruzada."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={ventasData}
                margin={{ top: 8, right: 40, bottom: 8, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0]?.payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <p className="font-semibold mb-1">
                          Sucursal {d?.nombre}
                        </p>
                        <p className="text-blue-600">
                          Ventas: ${d?.ventasK}k MXN
                        </p>
                        <p className="text-green-600">
                          Ticket prom.: {formatCurrency(d?.ticketPromedio)}
                        </p>
                        <p className="text-muted-foreground">
                          Tickets: {formatNumber(d?.numTickets)}
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="ventasK"
                  name="Ventas (miles MXN)"
                  radius={[4, 4, 0, 0]}
                >
                  {ventasData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Radar chart */}
          <ChartCard
            title="Radar de Desempeño (índice 0–100)"
            description="Cada métrica normalizada respecto al máximo de sucursales"
            explanation="El gráfico de radar normaliza varias métricas (ventas, tickets, ticket promedio, etc.) en una escala común para poder comparar el perfil integral de cada sucursal. Una sucursal 'perfecta' tendría un polígono grande y equilibrado. Si una sucursal tiene un vértice muy pequeño en alguna métrica, esa es su principal área de mejora."
          >
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 10 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9 }}
                  tickCount={4}
                />
                {data.map((suc, i) => (
                  <Radar
                    key={suc.id}
                    name={suc.nombre}
                    dataKey={suc.nombre}
                    stroke={SUC_COLORS[i]}
                    fill={SUC_COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend
                  formatter={(value) => (
                    <span className="text-xs">{value}</span>
                  )}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Clients and products comparison */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Clientes Únicos por Sucursal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={clientesData}
                  margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatNumber(v), "Clientes únicos"]}
                  />
                  <Bar dataKey="clientesUnicos" radius={[4, 4, 0, 0]}>
                    {clientesData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                SKUs Únicos Vendidos por Sucursal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={clientesData}
                  margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [v, "SKUs únicos"]}
                  />
                  <Bar dataKey="productosUnicos" radius={[4, 4, 0, 0]}>
                    {clientesData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Full ranking table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Ranking Completo de Sucursales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Posición
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Sucursal
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Ventas Totales
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Tickets
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Ticket Promedio
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Clientes Únicos
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Top Producto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((suc, i) => (
                    <tr
                      key={suc.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{
                            backgroundColor:
                              SUC_COLORS[data.findIndex((d) => d.id === suc.id)],
                          }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold flex items-center gap-2">
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                        {suc.nombre}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold">
                        {formatCurrency(suc.ventasTotales)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {formatNumber(suc.numTickets)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {formatCurrency(suc.ticketPromedio)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {formatNumber(suc.clientesUnicos)}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground truncate max-w-[180px]">
                        {suc.topProducto}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
