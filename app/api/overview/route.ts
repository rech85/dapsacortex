// app/api/overview/route.ts
// AWS Lambda equivalent: GET /api/overview
// Future: fetch from DynamoDB with pre-aggregated daily stats
import { NextRequest, NextResponse } from "next/server"
import { computeOverview } from "@/lib/analytics"
import { getTickets } from "@/lib/data-source"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined

  const data = computeOverview(await getTickets(), sucursal)

  return NextResponse.json(data)
}
