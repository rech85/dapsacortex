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
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { ShoppingBasket, Store } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { ChartCard } from "@/components/ui/chart-card"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { CanastaStats } from "@/lib/analytics"

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
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-80 rounded-lg bg-muted" />
        <div className="h-80 rounded-lg bg-muted" />
      </div>
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  )
}

export default function CanastaPage() {
  const [data, setData] = useState<CanastaStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sucursal, setSucursal] = useState("todas")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/canasta?sucursal=${sucursal}`)
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
          title="Inteligencia de Canasta"
          subtitle="Penetración de productos y co-ocurrencia"
        />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!data) return null

  const penetracionData = data.topPenetracion.map((p) => ({
    nombre: p.nombre.length > 22 ? p.nombre.slice(0, 22) + "…" : p.nombre,
    nombreCompleto: p.nombre,
    penetracion: parseFloat(p.penetracion.toFixed(1)),
    ventas: p.ventas,
    categoria: p.categoria,
  }))

  const scatterData = data.penetracionPorProducto
    .filter((p) => p.penetracion > 0)
    .map((p) => ({
      x: parseFloat(p.penetracion.toFixed(1)),
      y: Math.round(p.ventas / 1000),
      z: p.numTickets,
      nombre: p.nombre,
      categoria: p.categoria,
    }))

  return (
    <div>
      <Header
        title="Inteligencia de Canasta"
        subtitle="Penetración de productos y patrones de co-ocurrencia"
      />

      <div className="p-6 space-y-6">
        {/* Filter */}
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

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Top penetración</p>
              <p className="text-2xl font-bold mt-1">
                {data.topPenetracion[0]?.penetracion.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {data.topPenetracion[0]?.nombre}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Par más frecuente</p>
              <p className="text-lg font-bold mt-1 leading-tight">
                {data.topCoOcurrencia[0]?.frecuencia.toLocaleString()} tickets
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.topCoOcurrencia[0]?.soporte.toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">SKUs con +10% penetración</p>
              <p className="text-2xl font-bold mt-1">
                {data.penetracionPorProducto.filter((p) => p.penetracion >= 10).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">de 50 productos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top 10 by penetration */}
          <ChartCard
            title="Top 10 Productos por Penetración"
            description="% de tickets que incluyen cada producto"
            explanation="La penetración mide en qué porcentaje de los tickets aparece cada producto. Si el Arroz aparece en el 65% de tickets, significa que 65 de cada 100 clientes lo compran. Un producto ancla tiene penetración alta aunque no sea el más caro. Son la base del surtido y no deben faltar jamás."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={penetracionData}
                layout="vertical"
                margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
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
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, "dataMax + 5"]}
                />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  formatter={(value: number, _: string, props: { payload?: { nombreCompleto?: string; ventas?: number } }) => [
                    `${value}% de tickets`,
                    props.payload?.nombreCompleto || "",
                  ]}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <p className="font-semibold mb-1">{d.nombreCompleto}</p>
                        <p className="text-muted-foreground">
                          Categoría: {d.categoria}
                        </p>
                        <p className="text-blue-600 font-medium">
                          Penetración: {d.penetracion}%
                        </p>
                        <p className="text-muted-foreground">
                          Ventas: {formatCurrency(d.ventas)}
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="penetracion"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    fontSize: 9,
                    formatter: (v: number) => `${v}%`,
                  }}
                >
                  <ShoppingBasket className="h-4 w-4 text-blue-500" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Scatter: penetration vs ventas */}
          <ChartCard
            title="Penetración vs Ventas (todos los SKUs)"
            description="Cada punto es un producto. Tamaño = número de tickets"
            explanation="Cada punto es un producto. El eje X muestra su penetración (qué tan seguido lo compran) y el eje Y sus ventas en pesos. Los productos en la parte inferior derecha se venden en muchos tickets pero generan menos valor: son productos ancla. Los de arriba derecha son los mejores: muy frecuentes y con buen valor."
          >
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Penetración"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Penetración (%)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Ventas"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}k`}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[20, 200]}
                  name="Tickets"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <p className="font-semibold mb-1">{d.nombre}</p>
                        <p className="text-muted-foreground">
                          Categoría: {d.categoria}
                        </p>
                        <p className="text-blue-600">
                          Penetración: {d.x}%
                        </p>
                        <p className="text-green-600">
                          Ventas: ${d.y}k MXN
                        </p>
                        <p className="text-muted-foreground">
                          Tickets: {d.z.toLocaleString()}
                        </p>
                      </div>
                    )
                  }}
                />
                <Scatter
                  data={scatterData}
                  fill="#3b82f6"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Co-occurrence table */}
        <ChartCard
          title="Pares de Productos más Frecuentes (Co-ocurrencia)"
          description="Productos que aparecen juntos en el mismo ticket — oportunidades de cross-sell y combos"
          explanation="Esta tabla muestra qué pares de productos se compran juntos con más frecuencia. El 'soporte' indica en qué porcentaje del total de tickets aparecen ambos productos juntos. Un soporte alto (>15%) significa que la combinación es muy común y es candidata ideal para una oferta de combo o exhibición conjunta en el anaquel."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                    #
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                    Producto A
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                    Producto B
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                    Tickets juntos
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                    Soporte
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                    Oportunidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topCoOcurrencia.map((pair, i) => (
                  <tr
                    key={`${pair.producto1}-${pair.producto2}`}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2 px-3 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="py-2 px-3 font-medium">{pair.nombre1}</td>
                    <td className="py-2 px-3 font-medium">{pair.nombre2}</td>
                    <td className="py-2 px-3 text-right">
                      {pair.frecuencia.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge
                        variant={
                          pair.soporte > 20
                            ? "default"
                            : pair.soporte > 10
                            ? "info"
                            : "secondary"
                        }
                      >
                        {pair.soporte.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Badge
                        variant={
                          pair.soporte > 20
                            ? "success"
                            : pair.soporte > 10
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {pair.soporte > 20
                          ? "Alta"
                          : pair.soporte > 10
                          ? "Media"
                          : "Baja"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
