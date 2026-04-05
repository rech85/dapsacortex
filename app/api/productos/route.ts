// app/api/productos/route.ts
// AWS Lambda: GET /api/productos
import { NextRequest, NextResponse } from "next/server"
import { computeProductos } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined
  const data = computeProductos(sucursal)
  return NextResponse.json(data)
}
