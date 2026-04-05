import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lightbulb, TrendingUp, ShoppingCart, Store, Zap } from "lucide-react"
import type { AutoInsight } from "@/lib/analytics"

const tipoConfig = {
  ancla: { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  oportunidad: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  promocion: { icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  sucursal: { icon: Store, color: "text-purple-600", bg: "bg-purple-50" },
  tendencia: { icon: Lightbulb, color: "text-orange-600", bg: "bg-orange-50" },
}

const impactoVariant: Record<string, "default" | "warning" | "secondary"> = {
  alto: "default",
  medio: "warning",
  bajo: "secondary",
}

export function InsightCard({ insight }: { insight: AutoInsight }) {
  const config = tipoConfig[insight.tipo]
  const Icon = config.icon

  return (
    <Card className="transition-all hover:shadow-md animate-fade-in">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className={cn("p-2.5 rounded-lg shrink-0 h-fit", config.bg)}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm leading-snug">{insight.titulo}</h3>
              <Badge variant={impactoVariant[insight.impacto]} className="shrink-0 text-xs">
                {insight.impacto === "alto"
                  ? "Alto impacto"
                  : insight.impacto === "medio"
                  ? "Impacto medio"
                  : "Bajo impacto"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{insight.descripcion}</p>
            <div className="flex items-center gap-2 p-2.5 bg-muted rounded-md">
              <Lightbulb className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs font-medium text-muted-foreground">{insight.accion}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
