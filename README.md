# Agua

Plataforma web + móvil para la venta y reparto de agua en bidones.

- **Frontend**: React + Vite (SPA, PWA, APK Android con Capacitor)
- **Backend**: Node.js + Express (API REST / Vercel Serverless Ready)
- **Base de datos**: PostgreSQL en la nube (Supabase)
- **Despliegue**: Listo para Vercel en 1 clic (Monorepo con frontend y serverless backend).

## Estructura

```
Agua/
├── api/            # Serverless Entry Point para Vercel (/api/index.js)
├── backend/        # API REST (Express + pg)
│   ├── src/
│   │   ├── config/      # env, conexión a BD (SSL support)
│   │   ├── middlewares/ # auth, errores, validación, rate limit
│   │   ├── modules/     # auth, products, orders, containers, cron, ...
│   │   └── utils/
│   ├── db/
│   │   ├── migrations/  # SQL versionado (001–007)
│   │   └── seeds/       # datos de prueba
│   └── test/            # Vitest + Supertest
├── frontend/       # SPA React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/    # cliente API
│   │   ├── context/     # auth, cart
│   │   └── App.jsx      # rutas (lazy loading)
│   ├── public/          # PWA (manifest, service worker)
│   └── android/         # proyecto Capacitor para APK
├── docs/           # análisis y documentación de despliegue
├── package.json    # Configuración Monorepo con npm workspaces
├── vercel.json     # Configuración de routing y cron jobs para Vercel
└── README.md
```

## Requisitos

- Node.js 18+ (recomendado: 22 LTS o 24)
- Proyecto Supabase (PostgreSQL) con la connection string
- (Opcional) Android Studio + SDK para compilar el APK

## Configuración inicial

### Desarrollo Local (con un solo comando)

```bash
# 1. Instalar dependencias en todo el monorepo
npm install

# 2. Configurar variables de entorno del backend
cd backend
cp .env.example .env   # completar DATABASE_URL y JWT_SECRET
cd ..

# 3. Correr migraciones y seeds en la base de datos
npm run db:setup

# 4. Iniciar Frontend + Backend concurrentemente
npm run dev
```

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:4000`

---

## Despliegue en Vercel

El proyecto está 100% optimizado para **Vercel**:
1. Conectá el repositorio a Vercel.
2. Vercel detecta la raíz automáticamente (`vercel.json` y `package.json`).
3. Agregá en **Settings > Environment Variables**:
   - `DATABASE_URL`: Connection string de Supabase.
   - `JWT_SECRET`: Clave aleatoria y segura.
   - `NODE_ENV`: `production`
4. Hacé clic en **Deploy**.

Para más opciones y detalles, consultá [docs/DEPLOY.md](docs/DEPLOY.md).

---

## Usuarios de prueba (seeds)

| Rol      | Email                  | Contraseña |
|----------|------------------------|------------|
| Admin    | admin@agua.com         | 123456     |
| Repartidor | repartidor@agua.com  | 123456     |
| Cliente  | juan@cliente.com       | 123456     |
| Cliente  | maria@cliente.com      | 123456     |
| Cliente  | pedro@cliente.com      | 123456     |

---

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia backend y frontend en paralelo |
| `npm run build` | Compila el frontend para producción (`dist/`) |
| `npm test` | Corre la suite de tests (Vitest + Supertest) |
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:seed` | Carga datos de prueba |
| `npm run db:setup` | Migraciones + seeds |
| `npm run lint` | Lint del frontend con oxlint |
| `npm run apk:sync` (frontend) | Build web + sync Capacitor |
| `npm run apk:open` (frontend) | Abre Android Studio |

---

## API (resumen)

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/login` | Público |
| GET | `/api/products` | Público |
| GET/POST/PATCH | `/api/orders` | Cliente / Admin / Repartidor |
| GET/POST | `/api/addresses` | Cliente |
| GET | `/api/zones` | Público |
| GET/POST/PATCH | `/api/subscriptions` | Cliente |
| GET | `/api/cron/subscriptions` | Tarea programada / Vercel Cron |
| GET/POST/PUT/DELETE | `/api/promotions` | Público (GET) / Admin (CRUD) |
| GET/PATCH | `/api/notifications` | Autenticado |
| GET | `/api/containers/*` | Cliente / Admin |
| GET | `/api/dashboard` | Admin |
| GET | `/api/users` | Admin |
| GET | `/api/health` | Estado de la API y conexión a BD |
