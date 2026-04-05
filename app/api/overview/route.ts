// app/api/overview/route.ts
// AWS Lambda equivalent: GET /api/overview
// Future: fetch from DynamoDB with pre-aggregated daily stats
import { NextRequest, NextResponse } from "next/server"
import { computeOverview } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined

  // NOTE: In production, this will query DynamoDB GSI by sucursal + date range
  const data = computeOverview(sucursal)

  return NextResponse.json(data)
}
