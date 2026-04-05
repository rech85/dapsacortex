"use client"
import * as React from "react"
import { useState } from "react"
import { Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  explanation: string  // plain-language explanation of the chart
  children: React.ReactNode
  className?: string
  headerExtra?: React.ReactNode
}

export function ChartCard({ title, description, explanation, children, className, headerExtra }: ChartCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <Card className={cn("transition-all", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-0.5">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerExtra}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                showExplanation
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              type="button"
              title="¿Cómo leer esta gráfica?"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">¿Cómo leer esto?</span>
              {showExplanation ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        {showExplanation && (
          <div className="mt-2 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-2.5">
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{explanation}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
