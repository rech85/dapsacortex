"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Brain,
  RefreshCw,
  Store,
  Zap,
  TrendingUp,
  ShoppingCart,
  Lightbulb,
  Filter,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { InsightCard } from "@/components/dashboard/insight-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AutoInsight } from "@/lib/analytics"

const SUCURSALES = [
  { id: "todas", nombre: "Todas las sucursales" },
  { id: "S001", nombre: "Juárez" },
  { id: "S002", nombre: "Montoya" },
  { id: "S003", nombre: "Saucito" },
  { id: "S004", nombre: "Moreno" },
  { id: "S005", nombre: "Salk" },
]

const TIPO_FILTERS = [
  { id: "todos", label: "Todos", icon: Filter },
  { id: "ancla", label: "Ancla", icon: Zap },
  { id: "oportunidad", label: "Oportunidad", icon: TrendingUp },
  { id: "promocion", label: "Promoción", icon: ShoppingCart },
  { id: "sucursal", label: "Sucursal", icon: Store },
  { id: "tendencia", label: "Tendencia", icon: Lightbulb },
]

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-36 rounded-lg bg-muted" />
      ))}
    </div>
  )
}

export default function InsightsPage() {
  const [data, setData] = useState<AutoInsight[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [sucursal, setSucursal] = useState("todas")
  const [tipoFilter, setTipoFilter] = useState("todos")

  const fetchInsights = useCallback(
    (showRegenAnim = false) => {
      if (showRegenAnim) {
        setRegenerating(true)
      } else {
        setLoading(true)
      }
      fetch(`/api/insights?sucursal=${sucursal}`)
        .then((r) => r.json())
        .then((d: AutoInsight[]) => {
          setData(d)
          setLoading(false)
          setRegenerating(false)
        })
    },
    [sucursal]
  )

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  const filtered = data
    ? tipoFilter === "todos"
      ? data
      : data.filter((i) => i.tipo === tipoFilter)
    : []

  const countByImpacto = data
    ? {
        alto: data.filter((i) => i.impacto === "alto").length,
        medio: data.filter((i) => i.impacto === "medio").length,
        bajo: data.filter((i) => i.impacto === "bajo").length,
      }
    : { alto: 0, medio: 0, bajo: 0 }

  const countByTipo = data
    ? Object.fromEntries(
        TIPO_FILTERS.slice(1).map((t) => [
          t.id,
          data.filter((i) => i.tipo === t.id).length,
        ])
      )
    : {}

  return (
    <div>
      <Header
        title="Insights Automáticos"
        subtitle="Recomendaciones generadas por análisis de datos comerciales"
      />

      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          </div>
          <Button
            onClick={() => fetchInsights(true)}
            disabled={regenerating || loading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
            />
            {regenerating ? "Analizando..." : "Regenerar insights"}
          </Button>
        </div>

        {/* Summary stats */}
        {!loading && data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Total insights
                  </p>
                </div>
                <p className="text-2xl font-bold">{data.length}</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-xs text-blue-700 font-medium mb-1">
                  Alto impacto
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {countByImpacto.alto}
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <p className="text-xs text-amber-700 font-medium mb-1">
                  Impacto medio
                </p>
                <p className="text-2xl font-bold text-amber-800">
                  {countByImpacto.medio}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Bajo impacto
                </p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {countByImpacto.bajo}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Type filters */}
        {!loading && data && (
          <div className="flex flex-wrap gap-2">
            {TIPO_FILTERS.map((t) => {
              const Icon = t.icon
              const count =
                t.id === "todos" ? data.length : countByTipo[t.id] || 0
              return (
                <button
                  key={t.id}
                  onClick={() => setTipoFilter(t.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                    tipoFilter === t.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {t.label}
                  <Badge
                    variant={tipoFilter === t.id ? "secondary" : "outline"}
                    className="text-[10px] px-1.5 py-0 h-4 min-w-4"
                  >
                    {count}
                  </Badge>
                </button>
              )
            })}
          </div>
        )}

        {/* Insights grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : regenerating ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-blue-500 animate-pulse" />
              <div className="absolute -inset-2 rounded-full border-2 border-blue-300 animate-ping opacity-30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Analizando 10,000 tickets...
            </p>
            <p className="text-xs text-muted-foreground">
              Calculando penetraciones, co-ocurrencias y márgenes
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center gap-3 text-center">
              <Filter className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">
                No hay insights del tipo seleccionado
              </p>
              <p className="text-sm text-muted-foreground">
                Prueba con un filtro diferente o regenera los insights
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTipoFilter("todos")}
              >
                Ver todos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {/* Methodology note */}
        {!loading && (
          <Card className="bg-muted/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Metodología de generación de insights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Productos ancla:</strong> SKUs con penetración &gt;40%
                que no lideran ventas por valor.
              </p>
              <p>
                <strong>Co-ocurrencia:</strong> Análisis de pares de productos en
                el mismo ticket (soporte = % de tickets con ambos productos).
              </p>
              <p>
                <strong>Oportunidad de margen:</strong> Productos con margen
                &gt;25% y penetración &lt;20% — alto potencial sin explotar.
              </p>
              <p>
                <strong>Comparativa de sucursales:</strong> Diferencias en ticket
                promedio y frecuencia entre las 5 unidades operativas.
              </p>
              <p className="pt-1 text-muted-foreground/60">
                En producción: estos análisis correrán en AWS Lambda + SageMaker
                con actualización diaria vía EventBridge.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
