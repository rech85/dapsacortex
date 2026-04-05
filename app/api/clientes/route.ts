// app/api/clientes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { computeClientes, computeClientesPorTipo } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sucursal = searchParams.get("sucursal") || undefined
  const clientesData = computeClientes(sucursal)
  const tiposData = computeClientesPorTipo(sucursal)
  return NextResponse.json({ ...clientesData, tipos: tiposData })
}
