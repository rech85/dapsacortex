"use client"

import { useEffect, useState, useMemo } from "react"
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
  Cell,
} from "recharts"
import {
  Package,
  Store,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { ChartCard } from "@/components/ui/chart-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatPercent } from "@/lib/utils"
import type { ProductoStats } from "@/lib/analytics"

const SUCURSALES = [
  { id: "todas", nombre: "Todas las sucursales" },
  { id: "S001", nombre: "Juárez" },
  { id: "S002", nombre: "Montoya" },
  { id: "S003", nombre: "Saucito" },
  { id: "S004", nombre: "Moreno" },
  { id: "S005", nombre: "Salk" },
]

type SortKey = keyof Pick<
  ProductoStats,
  "ventas" | "unidades" | "penetracion" | "margen" | "margenPesos"
>

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="h-72 rounded-lg bg-muted" />
      <div className="h-96 rounded-lg bg-muted" />
    </div>
  )
}

const oportunidadVariant: Record<string, "default" | "warning" | "secondary"> = {
  alta: "default",
  media: "warning",
  baja: "secondary",
}

const SCATTER_COLORS = {
  alta: "#3b82f6",
  media: "#f59e0b",
  baja: "#94a3b8",
}

export default function ProductosPage() {
  const [data, setData] = useState<ProductoStats[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [sucursal, setSucursal] = useState("todas")
  const [sortKey, setSortKey] = useState<SortKey>("ventas")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [categoriaFilter, setCategoriaFilter] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/productos?sucursal=${sucursal}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [sucursal])

  const categorias = useMemo(() => {
    if (!data) return []
    return ["todas", ...Array.from(new Set(data.map((p) => p.categoria))).sort()]
  }, [data])

  const sorted = useMemo(() => {
    if (!data) return []
    let filtered = data
    if (categoriaFilter !== "todas") {
      filtered = filtered.filter((p) => p.categoria === categoriaFilter)
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return [...filtered].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortDir === "desc" ? -diff : diff
    })
  }, [data, sortKey, sortDir, categoriaFilter, searchQuery])

  const oportunidades = useMemo(
    () => data?.filter((p) => p.oportunidad === "alta") || [],
    [data]
  )

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return null
    return sortDir === "desc" ? (
      <ChevronDown className="h-3 w-3 inline ml-1" />
    ) : (
      <ChevronUp className="h-3 w-3 inline ml-1" />
    )
  }

  if (loading) {
    return (
      <div>
        <Header
          title="Inteligencia de Producto"
          subtitle="Ventas, márgenes y oportunidades por SKU"
        />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!data) return null

  const top10ventas = [...data]
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 10)
    .map((p) => ({
      nombre: p.nombre.length > 20 ? p.nombre.slice(0, 20) + "…" : p.nombre,
      nombreCompleto: p.nombre,
      ventasK: Math.round(p.ventas / 1000),
      margenK: Math.round(p.margenPesos / 1000),
      categoria: p.categoria,
    }))

  const scatterData = data
    .filter((p) => p.ventas > 0)
    .map((p) => ({
      x: parseFloat(p.penetracion.toFixed(1)),
      y: parseFloat((p.margen * 100).toFixed(1)),
      z: Math.round(p.ventas / 1000),
      nombre: p.nombre,
      oportunidad: p.oportunidad,
      categoria: p.categoria,
    }))

  return (
    <div>
      <Header
        title="Inteligencia de Producto"
        subtitle="Ventas, márgenes, penetración y oportunidades por SKU"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Store className="h-4 w-4 text-muted-foreground" />
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
          <Package className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c === "todas" ? "Todas las categorías" : c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48"
          />
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total en ventas</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(data.reduce((s, p) => s + p.ventas, 0))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.length} SKUs activos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Margen total generado
              </p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(data.reduce((s, p) => s + p.margenPesos, 0))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Margen promedio:{" "}
                {formatPercent(
                  (data.reduce((s, p) => s + p.margen, 0) / data.length) * 100
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">
                  SKUs de alta oportunidad
                </p>
              </div>
              <p className="text-2xl font-bold mt-1 text-blue-800">
                {oportunidades.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Alto margen + baja penetración
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Oportunidades highlight */}
        {oportunidades.length > 0 && (
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                SKUs de Alta Oportunidad — Alto Margen, Baja Penetración
              </CardTitle>
              <CardDescription>
                Estos productos tienen margen &gt;25% pero aparecen en menos del 20% de los tickets. Con mayor visibilidad pueden incrementar el margen global significativamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {oportunidades.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-md border border-blue-200 bg-white p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">
                        {prod.nombre}
                      </p>
                      <Badge variant="default" className="shrink-0 text-xs">
                        {formatPercent(prod.margen * 100)} margen
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {prod.categoria}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Penetración: {formatPercent(prod.penetracion)}
                      </span>
                      <span className="font-semibold text-green-700">
                        +{formatCurrency(prod.margenPesos * 0.5)} potencial
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top 10 by ventas */}
          <ChartCard
            title="Top 10 por Ventas"
            description="Miles MXN — ventas vs margen generado"
            explanation="Muestra los 10 productos que más dinero generan. Las barras azules son ventas totales y las verdes el margen generado. Un producto puede vender mucho pero generar poco margen (ej. Coca-Cola). Lo ideal es identificar productos con buenas barras en ambos colores."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={top10ventas}
                layout="vertical"
                margin={{ left: 0, right: 16 }}
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
                  dataKey="nombre"
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <p className="font-semibold mb-1">
                          {d.nombreCompleto}
                        </p>
                        <p className="text-blue-600">
                          Ventas: ${d.ventasK}k MXN
                        </p>
                        <p className="text-green-600">
                          Margen: ${d.margenK}k MXN
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="ventasK"
                  fill="#3b82f6"
                  radius={[0, 2, 2, 0]}
                  name="Ventas"
                />
                <Bar
                  dataKey="margenK"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                  name="Margen"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Scatter: penetration vs margin */}
          <ChartCard
            title="Penetración vs Margen — Mapa de Oportunidades"
            description="Arriba izquierda = alto margen + baja penetración = mayor oportunidad"
            explanation="Cada punto es un producto. El eje X es su penetración (frecuencia de compra) y el eje Y su margen porcentual. Los puntos azules en la esquina superior izquierda son los de mayor oportunidad: tienen buen margen pero pocos clientes los compran, lo que significa que con mejor visibilidad en góndola podrían generar mucho más margen sin cambiar el precio."
          >
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
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
                    offset: -8,
                    fontSize: 10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Margen"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Margen (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 8,
                    fontSize: 10,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[20, 300]}
                  name="Ventas"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                        <p className="font-semibold mb-1">{d.nombre}</p>
                        <p className="text-muted-foreground">
                          {d.categoria}
                        </p>
                        <p>Penetración: {d.x}%</p>
                        <p>Margen: {d.y}%</p>
                        <p>Ventas: ${d.z}k MXN</p>
                      </div>
                    )
                  }}
                />
                <Scatter data={scatterData} fillOpacity={0.75}>
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        SCATTER_COLORS[
                          entry.oportunidad as keyof typeof SCATTER_COLORS
                        ]
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
                Alta oportunidad
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                Media
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
                Baja
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Full product table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Catálogo de Productos — {sorted.length} SKUs
            </CardTitle>
            <CardDescription>
              Haz clic en los encabezados para ordenar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Producto
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Categoría
                    </th>
                    <th
                      className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("ventas")}
                    >
                      Ventas <SortIcon k="ventas" />
                    </th>
                    <th
                      className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("unidades")}
                    >
                      Unidades <SortIcon k="unidades" />
                    </th>
                    <th
                      className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("penetracion")}
                    >
                      Penetración <SortIcon k="penetracion" />
                    </th>
                    <th
                      className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("margen")}
                    >
                      Margen % <SortIcon k="margen" />
                    </th>
                    <th
                      className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("margenPesos")}
                    >
                      Margen MXN <SortIcon k="margenPesos" />
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs">
                      Oportunidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((prod) => (
                    <tr
                      key={prod.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium">{prod.nombre}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        {prod.categoria}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {formatCurrency(prod.ventas)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {prod.unidades.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-muted rounded-full h-1.5 hidden sm:block">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{
                                width: `${Math.min(prod.penetracion, 100)}%`,
                              }}
                            />
                          </div>
                          <span>{formatPercent(prod.penetracion)}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {formatPercent(prod.margen * 100)}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-green-700">
                        {formatCurrency(prod.margenPesos)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <Badge variant={oportunidadVariant[prod.oportunidad]}>
                          {prod.oportunidad === "alta"
                            ? "Alta"
                            : prod.oportunidad === "media"
                            ? "Media"
                            : "Baja"}
                        </Badge>
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
