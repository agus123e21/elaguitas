# Agua

Plataforma web + móvil para la venta y reparto de agua en bidones.

- **Frontend**: React + Vite (SPA, PWA, APK Android con Capacitor)
- **Backend**: Node.js + Express (API REST)
- **Base de datos**: PostgreSQL en la nube (Supabase)

## Estructura

```
Agua/
├── backend/    # API REST (Express + pg)
│   ├── src/
│   │   ├── config/      # env, conexión a BD
│   │   ├── middlewares/ # auth, errores, validación, rate limit
│   │   ├── modules/     # auth, products, orders, containers, ...
│   │   └── utils/
│   ├── db/
│   │   ├── migrations/  # SQL versionado (001–007)
│   │   └── seeds/       # datos de prueba
│   └── test/            # Vitest + Supertest
├── frontend/   # SPA React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/    # cliente API
│   │   ├── context/     # auth, cart
│   │   └── App.jsx      # rutas (lazy loading)
│   ├── public/          # PWA (manifest, service worker)
│   └── android/         # proyecto Capacitor para APK
├── docs/       # análisis y documentación
└── README.md
```

## Requisitos

- Node.js 18+ (recomendado: 22 LTS o 24)
- Proyecto Supabase (PostgreSQL) con la connection string
- (Opcional) Android Studio + SDK para compilar el APK

## Configuración inicial

### 1. Backend

```bash
cd backend
cp .env.example .env   # completar DATABASE_URL y JWT_SECRET
npm install
npm run db:setup       # migraciones + seeds
npm run dev            # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

En desarrollo, Vite redirige `/api/*` al backend (`localhost:4000`), así que no hace falta CORS extra.

## Usuarios de prueba (seeds)

| Rol      | Email                  | Contraseña |
|----------|------------------------|------------|
| Admin    | admin@agua.com         | 123456     |
| Repartidor | repartidor@agua.com  | 123456     |
| Cliente  | juan@cliente.com       | 123456     |
| Cliente  | maria@cliente.com      | 123456     |
| Cliente  | pedro@cliente.com      | 123456     |

## Estado del proyecto

Sigue el plan de 20 fases definido en `docs/ANALISIS.md`.

| Fase | Estado |
|------|--------|
| 0 Análisis | ✅ |
| 1 Arquitectura inicial | ✅ |
| 2 Base de datos (esquema, migraciones, seeds) | ✅ |
| 3 Autenticación y roles | ✅ |
| 4 Productos y carrito | ✅ |
| 5 Pedidos, checkout, direcciones, zonas y promociones | ✅ |
| 6 Direcciones (frontend) y zonas (admin) | ✅ |
| 7 Bidones (balance, historial, inventario) | ✅ |
| 8 Panel administrativo con estadísticas | ✅ |
| 9 Panel del repartidor | ✅ |
| 10 Suscripciones recurrentes | ✅ |
| 11 Promociones (CRUD admin + catálogo) | ✅ |
| 12 Notificaciones | ✅ |
| 13 UI responsive | ✅ |
| 14 PWA (manifest + service worker) | ✅ |
| 15 APK Android (Capacitor) | ✅ |
| 16 Seguridad (helmet, rate limiting) | ✅ |
| 17 Testing (Vitest + Supertest) | ✅ |
| 18 Optimización (lazy loading) | ✅ |
| 19 Documentación | ✅ |
| 20 Publicación y mantenimiento | ⏳ |

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:seed` | Carga datos de prueba |
| `npm run db:setup` | Migraciones + seeds |
| `npm test` (backend) | Corre la suite de tests (Vitest) |
| `npm run lint` (frontend) | Lint del frontend (oxlint) |
| `npm run apk:sync` (frontend) | Build web + sync Capacitor |
| `npm run apk:open` (frontend) | Abre Android Studio |

## API (resumen)

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/login` | Público |
| GET | `/api/products` | Público |
| GET/POST/PATCH | `/api/orders` | Cliente / Admin / Repartidor |
| GET/POST | `/api/addresses` | Cliente |
| GET | `/api/zones` | Público |
| GET/POST/PATCH | `/api/subscriptions` | Cliente |
| GET/POST/PUT/DELETE | `/api/promotions` | Público (GET) / Admin (CRUD) |
| GET/PATCH | `/api/notifications` | Autenticado |
| GET | `/api/containers/*` | Cliente / Admin |
| GET | `/api/dashboard` | Admin |
| GET | `/api/users` | Admin |

## Verificación

- `GET /api/health` devuelve estado de la API y la conexión a la BD.
- La suite de tests se corre con `npm test` dentro de `backend/`.
