"use client"

import { useEffect, useState } from "react"
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Users, Store, UserCheck, UserPlus, Repeat, Target } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { ChartCard } from "@/components/ui/chart-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { ClienteSegmento, TipoClienteStats } from "@/lib/analytics"

const SUCURSALES = [
  { id: "todas", nombre: "Todas las sucursales" },
  { id: "S001", nombre: "Juárez" },
  { id: "S002", nombre: "Montoya" },
  { id: "S003", nombre: "Saucito" },
  { id: "S004", nombre: "Moreno" },
  { id: "S005", nombre: "Salk" },
]

interface ClienteData {
  segmentos: ClienteSegmento[]
  frecuenciaGlobal: number
  ticketPromedioGlobal: number
  distribucion: { rango: string; count: number }[]
  totalClientes: number
  tipoBreakdown: { id: string; nombre: string; color: string; count: number; numTickets: number; porcentaje: number }[]
  tipos: TipoClienteStats[]
}

const SEGMENT_COLORS: Record<string, string> = {
  Frecuente: "#3b82f6",
  Ocasional: "#f59e0b",
  Nuevo: "#10b981",
}

const SEGMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Frecuente: Repeat,
  Ocasional: UserCheck,
  Nuevo: UserPlus,
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-lg bg-muted" />)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-72 rounded-lg bg-muted" />
        <div className="h-72 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-lg bg-muted" />)}
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180
function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.05) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ClientesPage() {
  const [data, setData] = useState<ClienteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sucursal, setSucursal] = useState("todas")

  useEffect(() => {
    setLoading(true)
    fetch(`/api/clientes?sucursal=${sucursal}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
  }, [sucursal])

  if (loading) return (
    <div>
      <Header title="Inteligencia de Cliente" subtitle="Tipos, segmentación y estrategias por perfil de compra" />
      <LoadingSkeleton />
    </div>
  )
  if (!data) return null

  const pieSegmentData = data.segmentos.map((s) => ({ name: s.segmento, value: s.count }))
  const pietipoData = data.tipos.map((t) => ({ name: t.nombre, value: t.numTickets, color: t.color }))
  const comparativaData = data.segmentos.map((s) => ({
    segmento: s.segmento, ticketPromedio: parseFloat(s.ticketPromedio.toFixed(2)), frecuencia: parseFloat(s.frecuenciaPromedio.toFixed(1)),
  }))
  const tipoComparativaData = data.tipos.map((t) => ({
    nombre: t.nombre, ticketPromedio: parseFloat(t.ticketPromedio.toFixed(2)),
    ventas: Math.round(t.ventasTotales / 1000), frecuencia: parseFloat(t.frecuenciaPromedio.toFixed(1)),
    color: t.color,
  }))

  return (
    <div>
      <Header title="Inteligencia de Cliente" subtitle="Tipos de cliente, segmentación por recurrencia y estrategias comerciales" />

      <div className="p-6 space-y-8">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <Store className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium text-muted-foreground">Sucursal:</label>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <Users className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground">Clientes únicos</p>
              <p className="text-2xl font-bold">{formatNumber(data.totalClientes)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Repeat className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-sm text-muted-foreground">Frecuencia global</p>
              <p className="text-2xl font-bold">{data.frecuenciaGlobal.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">visitas promedio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <UserCheck className="h-5 w-5 text-green-500 mb-2" />
              <p className="text-sm text-muted-foreground">Ticket promedio global</p>
              <p className="text-2xl font-bold">{formatCurrency(data.ticketPromedioGlobal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Tasa de recurrencia</p>
              <p className="text-2xl font-bold">
                {(((data.segmentos.find((s) => s.segmento === "Frecuente")?.count || 0) / data.totalClientes) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">clientes frecuentes</p>
            </CardContent>
          </Card>
        </div>

        {/* ─── TIPOS DE CLIENTE ─────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Tipos de Cliente
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Segmentación por perfil de negocio — con estrategias comerciales recomendadas por segmento
          </p>

          {/* Type cards grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
            {data.tipos.map((tipo) => (
              <Card key={tipo.id} className="overflow-hidden" style={{ borderTop: `3px solid ${tipo.color}` }}>
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{tipo.emoji}</span>
                        <span className="font-bold text-sm">{tipo.nombre}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{tipo.descripcion}</p>
                    </div>
                    <Badge style={{ backgroundColor: tipo.color + "20", color: tipo.color, border: `1px solid ${tipo.color}40` }} className="shrink-0 text-xs">
                      {tipo.porcentajeTickets.toFixed(0)}%
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-[10px] text-muted-foreground">Clientes</p>
                      <p className="text-sm font-bold">{formatNumber(tipo.numClientes)}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-[10px] text-muted-foreground">Ticket prom.</p>
                      <p className="text-sm font-bold">{formatCurrency(tipo.ticketPromedio)}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-[10px] text-muted-foreground">Tickets</p>
                      <p className="text-sm font-bold">{formatNumber(tipo.numTickets)}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-[10px] text-muted-foreground">Frecuencia</p>
                      <p className="text-sm font-bold">{tipo.frecuenciaPromedio.toFixed(1)}x</p>
                    </div>
                  </div>

                  {/* Top products */}
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Top productos</p>
                    <div className="flex flex-wrap gap-1">
                      {tipo.topProductos.slice(0, 3).map((prod) => (
                        <span key={prod.nombre} className="text-[10px] rounded-full px-2 py-0.5 bg-muted border">
                          {prod.nombre.length > 18 ? prod.nombre.slice(0, 18) + "…" : prod.nombre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="rounded-md p-2.5" style={{ backgroundColor: tipo.color + "12", border: `1px solid ${tipo.color}30` }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: tipo.color }}>
                      Estrategia recomendada
                    </p>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">{tipo.estrategia}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tipo charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Distribución de Tickets por Tipo de Cliente"
              description="Proporción del volumen de ventas por perfil"
              explanation="Esta gráfica de dona muestra qué porcentaje de los tickets totales genera cada tipo de cliente. Los tenderos dominan en volumen (~80%), pero no necesariamente en valor unitario. Los segmentos pequeños como restauranteros y taqueros representan oportunidades de crecimiento por su mayor ticket promedio."
            >
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pietipoData} cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                    dataKey="value" labelLine={false} label={CustomPieLabel}>
                    {pietipoData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${formatNumber(value)} tickets`, name]} />
                  <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Ticket Promedio por Tipo de Cliente"
              description="Valor económico promedio de cada perfil de compra"
              explanation="Esta gráfica compara el monto promedio que gasta cada tipo de cliente en una sola visita. Un ticket promedio alto en un segmento pequeño (como restauranteros) indica que vale la pena invertir en una estrategia de atención diferenciada para ese grupo, aunque represente pocos clientes en número."
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={tipoComparativaData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="nombre" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Ticket promedio"]} />
                  <Bar dataKey="ticketPromedio" radius={[4, 4, 0, 0]}>
                    {tipoComparativaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* ─── SEGMENTACIÓN POR RECURRENCIA ──────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Segmentación por Recurrencia
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Clasificación de clientes según su frecuencia de visita (RFM simplificado)
          </p>

          {/* Segment cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            {data.segmentos.map((seg) => {
              const Icon = SEGMENT_ICONS[seg.segmento]
              const color = SEGMENT_COLORS[seg.segmento]
              return (
                <Card key={seg.segmento} className="border-l-4" style={{ borderLeftColor: color }}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div style={{ color }}><Icon className="h-5 w-5" /></div>
                        <span className="font-semibold">{seg.segmento}</span>
                      </div>
                      <Badge style={{ backgroundColor: color + "20", color, border: `1px solid ${color}40` }}>
                        {seg.porcentaje.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Clientes</span>
                        <span className="font-semibold">{formatNumber(seg.count)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ticket promedio</span>
                        <span className="font-semibold">{formatCurrency(seg.ticketPromedio)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Visitas promedio</span>
                        <span className="font-semibold">{seg.frecuenciaPromedio.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${seg.porcentaje}%`, backgroundColor: color }} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Distribución de Segmentos por Recurrencia"
              description="Composición de la base de clientes por frecuencia de visita"
              explanation="Esta dona muestra la proporción de clientes según cuántas veces han comprado. 'Frecuente' son clientes con 5+ visitas, 'Ocasional' con 2-4 visitas y 'Nuevo' con solo 1 visita. Idealmente se busca mover clientes del anillo verde (nuevo) hacia el azul (frecuente)."
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieSegmentData} cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                    dataKey="value" labelLine={false} label={CustomPieLabel}>
                    {pieSegmentData.map((entry) => (
                      <Cell key={entry.name} fill={SEGMENT_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${formatNumber(value)} clientes`, name]} />
                  <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Ticket Promedio y Frecuencia por Segmento"
              description="Valor económico y comportamiento comparado entre segmentos"
              explanation="Las barras azules muestran el ticket promedio (cuánto gasta en cada visita), mientras las barras verdes muestran la frecuencia (cuántas veces viene al mes). Un cliente frecuente ideal tendría ambas barras altas. Si la frecuencia es alta pero el ticket es bajo, hay oportunidad de venta cruzada."
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparativaData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="segmento" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}x`} />
                  <Tooltip formatter={(value: number, name: string) =>
                    name === "ticketPromedio" ? [formatCurrency(value), "Ticket promedio"] : [`${value} visitas`, "Frecuencia"]} />
                  <Legend formatter={(value) => value === "ticketPromedio" ? "Ticket Promedio" : "Frecuencia (visitas)"} />
                  <Bar yAxisId="left" dataKey="ticketPromedio" fill="#3b82f6" radius={[4, 4, 0, 0]} name="ticketPromedio" />
                  <Bar yAxisId="right" dataKey="frecuencia" fill="#10b981" radius={[4, 4, 0, 0]} name="frecuencia" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Frequency histogram */}
          <ChartCard
            className="mt-6"
            title="Histograma de Frecuencia de Visitas"
            description="Distribución de clientes por número de visitas registradas"
            explanation="Este histograma muestra cuántos clientes han visitado exactamente 1 vez, 2-4 veces, 5-9 veces o 10+ veces. La mayoría de los clientes de abarrotes mayoristas tienen pocas visitas. El objetivo estratégico es incrementar el número de barras en los rangos de mayor frecuencia."
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.distribucion} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="rango" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(value: number) => [formatNumber(value) + " clientes", "Cantidad"]} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.distribucion.map((entry, index) => {
                    const colors = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"]
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Fidelization callout */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-5">
            <h3 className="font-semibold text-blue-800 mb-2">Oportunidad de Fidelización</h3>
            <p className="text-sm text-blue-700">
              Los clientes <strong>Frecuentes</strong> generan un ticket promedio{" "}
              {(((data.segmentos.find((s) => s.segmento === "Frecuente")?.ticketPromedio || 0) /
                (data.segmentos.find((s) => s.segmento === "Nuevo")?.ticketPromedio || 1)) * 100 - 100).toFixed(0)}%
              mayor que los clientes <strong>Nuevos</strong>. Convertir clientes
              Ocasionales en Frecuentes mediante un programa de lealtad podría incrementar las ventas totales en un 15-20% sin incrementar el tráfico.
              Los <strong>taqueros y restauranteros</strong> merecen atención especial: aunque son pocos, su ticket individual es significativamente mayor.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
