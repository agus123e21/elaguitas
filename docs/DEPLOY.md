# Despliegue

Guía completa para poner el proyecto en producción y compilar el APK Android.

---

## Opciones de Despliegue

| Opción | Frontend | Backend | Recomendado para |
|--------|----------|---------|-------------------|
| **Opción 1** | Vercel | Vercel (Serverless Functions) | Producción unificada, 1 solo servicio, cero CORS, máxima velocidad |
| **Opción 2** | GitHub Pages | Render (Blueprint / Node.js) | Hosting gratuito alternativo |
| **Opción 3** | Vercel | Render / Railway / VPS | Arquitectura desacoplada con backend tradicional |

---

## Opción 1: Despliegue Fullstack en Vercel (Todo-en-Uno Recomendado)

El proyecto está preparado como un Monorepo con soporte nativo para **Vercel**:
* **Frontend**: Compilado estáticamente desde `frontend/dist` y servido mediante la CDN global de Vercel con soporte SPA (React Router).
* **Backend**: Ejecutado como Vercel Serverless Function en `/api/index.js` apuntando a la API Express.
* **Suscripciones automáticas**: Procesadas a través de **Vercel Cron Jobs** en `/api/cron/subscriptions`.

### Pasos para desplegar en Vercel:

1. Subí tu repositorio a GitHub.
2. En tu dashboard de **Vercel**, hacé clic en **"Add New Project"** e importá el repositorio `elaguitas`.
3. **Configuración del proyecto** (Vercel la detectará automáticamente desde `vercel.json` y `package.json` en la raíz):
   - **Root Directory**: `./` (la raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
4. **Variables de Entorno** (Environment Variables en Vercel):
   - `DATABASE_URL`: Connection string de PostgreSQL en Supabase (ej: `postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres`).
   - `JWT_SECRET`: Cadena secreta larga y aleatoria para firmar los tokens de autenticación.
   - `NODE_ENV`: `production`
   - *(Opcional)* `CRON_SECRET`: Secreto para autenticar la invocación de Vercel Cron.
5. Hacé clic en **Deploy**.

> **Ventaja de CORS**: Al estar frontend y backend desplegados juntos en Vercel en el mismo dominio, las peticiones van a `/api/*` automáticamente sin requerir configuración extra de CORS ni setear `VITE_API_URL`.

---

## Opción 2: Frontend en GitHub Pages + Backend en Render

### 1. Backend en Render (con Blueprint)
1. En Render: **New > Blueprint** y conectar el repositorio.
2. Render leerá `render.yaml` y creará el servicio `agua-backend`.
3. Completar las variables de entorno en Render:
   - `DATABASE_URL`: Connection string de Supabase.
   - `JWT_SECRET`: Clave secreta.
   - `FRONTEND_URL`: `https://agus123e21.github.io`
4. Las migraciones se aplican automáticamente (`preDeployCommand: npm run db:migrate`).

### 2. Frontend en GitHub Pages
1. En GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. En **Settings > Secrets and variables > Actions > Variables**:
   - `VITE_API_URL` → `https://agua-backend.onrender.com/api`
3. Al hacer push a `main` o `Arian`, el workflow `.github/workflows/deploy-frontend.yml` desplegará en:
   ```
   https://agus123e21.github.io/elaguitas/
   ```

---

## Opción 3: Frontend en Vercel + Backend en Render/Railway

1. **Backend**: Desplegar en Render o Railway usando la carpeta `backend` como Root Directory.
2. **Frontend**: En Vercel, configurar Root Directory en `frontend`, con la variable `VITE_API_URL=https://tu-backend.onrender.com/api`.

---

## 3. APK Android (Capacitor)

Requisitos: Node.js + Android Studio (JDK 17+, Android SDK).

```bash
# 1. Instalar dependencias
npm install

# 2. Build web + sincronización con Capacitor
# Si usás Vercel, la URL del backend es https://tu-proyecto.vercel.app/api
$env:VITE_API_URL="https://tu-proyecto.vercel.app/api"; npm run build:frontend; npx cap sync android --target frontend

# 3. Abrir Android Studio para generar el APK
npm run apk:open --workspace=frontend
```

En Android Studio:
1. Menú `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
2. El archivo queda generado en `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 4. Base de datos (Supabase)

1. En tu panel de Supabase SQL Editor, ejecutá las migraciones en orden desde `backend/db/migrations/`:
   - `001_initial_schema.sql`
   - `002_user_roles.sql`
   - `003_container_balance.sql`
   - `004_delivery_zones.sql`
   - `005_subscriptions_and_promotions.sql`
   - `006_notifications.sql`
   - `007_password_reset_tokens.sql`
2. O corré localmente contra Supabase: `npm run db:migrate`.

---

## Usuarios de prueba (seeds)

| Rol        | Email               | Contraseña |
|------------|---------------------|------------|
| Admin      | admin@agua.com      | 123456     |
| Repartidor | repartidor@agua.com | 123456     |
| Cliente    | juan@cliente.com    | 123456     |
| Cliente    | maria@cliente.com   | 123456     |
| Cliente    | pedro@cliente.com   | 123456     |
