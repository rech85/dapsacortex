// app/api/canasta/route.ts
// AWS Lambda: GET /api/canasta
// Future: Stored associations in DynamoDB from nightly batch job
import { NextRequest, NextResponse } from "next/server"
import { computeCanasta } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined
  const data = computeCanasta(sucursal)
  return NextResponse.json(data)
}
