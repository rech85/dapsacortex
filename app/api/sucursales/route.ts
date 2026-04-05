// app/api/sucursales/route.ts
// AWS Lambda: GET /api/sucursales
import { NextResponse } from "next/server"
import { computeSucursales } from "@/lib/analytics"

export async function GET() {
  const data = computeSucursales()
  return NextResponse.json(data)
}
