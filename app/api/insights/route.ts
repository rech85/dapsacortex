// app/api/insights/route.ts
// AWS Lambda: GET /api/insights
// Future: ML-powered insights via Amazon SageMaker + EventBridge scheduled runs
import { NextRequest, NextResponse } from "next/server"
import { computeInsights } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined
  const data = computeInsights(sucursal)
  return NextResponse.json(data)
}
