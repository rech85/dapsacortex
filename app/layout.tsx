import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DAPSA Cortex — Inteligencia Comercial",
  description:
    "Plataforma de inteligencia comercial para Grupo Dapsa. Convierte cada ticket en una decisión estratégica.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
