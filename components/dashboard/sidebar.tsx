"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBasket,
  Package,
  Users,
  Store,
  Brain,
  LogOut,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/canasta", label: "Inteligencia de Canasta", icon: ShoppingBasket },
  { href: "/dashboard/productos", label: "Inteligencia de Producto", icon: Package },
  { href: "/dashboard/clientes", label: "Inteligencia de Cliente", icon: Users },
  { href: "/dashboard/sucursales", label: "Por Sucursal", icon: Store },
  { href: "/dashboard/insights", label: "Insights Automáticos", icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight">DAPSA Cortex</span>
          <p className="text-[10px] text-muted-foreground">Inteligencia Comercial</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Análisis
        </p>
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="mb-2 rounded-md bg-muted px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Datos simulados</p>
          <p className="text-xs font-medium">10,000 tickets • 5 sucursales</p>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Link>
      </div>
    </aside>
  )
}
