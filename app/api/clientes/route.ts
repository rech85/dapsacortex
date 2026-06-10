// app/api/clientes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { computeClientes, computeClientesPorTipo } from "@/lib/analytics"
import { getTickets } from "@/lib/data-source"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined
  const tickets = await getTickets()
  const clientesData = computeClientes(tickets, sucursal)
  const tiposData = computeClientesPorTipo(tickets, sucursal)
  return NextResponse.json({ ...clientesData, tipos: tiposData })
}
