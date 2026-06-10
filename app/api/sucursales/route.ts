// app/api/sucursales/route.ts
// AWS Lambda: GET /api/sucursales
import { NextResponse } from "next/server"
import { computeSucursales } from "@/lib/analytics"
import { getTickets } from "@/lib/data-source"

export async function GET() {
  const data = computeSucursales(await getTickets())
  return NextResponse.json(data)
}
