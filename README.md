# DAPSA Cortex — Inteligencia Comercial

MVP de plataforma SaaS de inteligencia comercial para Grupo Dapsa, distribuidora mayorista de abarrotes.

## Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + ShadCN UI (manual)
- **Recharts** para visualizaciones
- **lucide-react** para íconos

## Módulos del Dashboard

| Módulo | Ruta | Descripción |
|---|---|---|
| Overview | `/dashboard` | KPIs globales, ventas por día y categoría |
| Inteligencia de Canasta | `/dashboard/canasta` | Penetración de productos, co-ocurrencia |
| Inteligencia de Producto | `/dashboard/productos` | Ventas, márgenes, oportunidades |
| Inteligencia de Cliente | `/dashboard/clientes` | Segmentación RFM simplificada |
| Por Sucursal | `/dashboard/sucursales` | Comparativa entre las 5 sucursales |
| Insights Automáticos | `/dashboard/insights` | Recomendaciones generadas automáticamente |

## Inicio rápido

```bash
npm install
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

**Credenciales demo:** `demo@dapsa.mx` / `demo2025`

## Arquitectura futura (AWS)

```
Frontend (Next.js / Vercel)
    ↓
API Gateway → Lambda Functions
    ↓
DynamoDB (tickets, productos, insights pre-computados)
    ↓
S3 + Athena (análisis histórico)
    ↓
SageMaker (ML insights)
    ↓
Cognito (autenticación)
```

## Datos de ejemplo

El MVP usa 10,000 tickets simulados con:
- 5 sucursales en Chihuahua
- 50 productos en 8 categorías
- 3,000 clientes únicos (60% recurrentes)
- 90 días de historial

Los datos son deterministas (semilla fija) para garantizar consistencia entre sesiones.
