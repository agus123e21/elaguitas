# Agua

Plataforma web + móvil para la venta y reparto de agua en bidones.

- **Frontend**: React + Vite (SPA, lista para PWA y APK con Capacitor)
- **Backend**: Node.js + Express (API REST)
- **Base de datos**: PostgreSQL en la nube (Supabase)

## Estructura

```
Agua/
├── backend/   # API REST (Express + pg)
│   └── src/
│       ├── config/      # env, conexión a BD
│       ├── middlewares/ # auth, errores, validación
│       ├── modules/     # auth, products, orders, ...
│       └── utils/
├── frontend/  # SPA React + Vite
├── docs/      # análisis y documentación
└── README.md
```

## Requisitos

- Node.js 18+ (recomendado: 22 LTS o 24)
- Proyecto Supabase (PostgreSQL) con la connection string

## Configuración inicial

### 1. Backend

```bash
cd backend
cp .env.example .env   # completar DATABASE_URL y JWT_SECRET
npm install
npm run dev            # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

En desarrollo, Vite redirige `/api/*` al backend (`localhost:4000`), así que no hace falta CORS extra.

### 3. Base de datos

```bash
cd backend
npm run db:migrate     # aplica migraciones SQL
npm run db:seed        # carga datos de prueba
```

## Estado del proyecto

Sigue el plan de 20 fases definido en `docs/ANALISIS.md`.

| Fase | Estado |
|------|--------|
| 0 Análisis | ✅ |
| 1 Arquitectura inicial | ✅ |
| 2 Base de datos | ⏳ |
| 3+ | Pendientes |

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:seed` | Carga datos de prueba |
| `npm run db:setup` | Migraciones + seeds |

## Verificación

- `GET /api/health` devuelve estado de la API y la conexión a la BD.
