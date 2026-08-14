# Despliegue

Guía para poner el proyecto en producción y compilar el APK Android.

## Enlaces en línea

- **Frontend (GitHub Pages):** https://agus123e21.github.io/elaguitas/
- **Backend (Render):** https://agua-backend.onrender.com
- **Health check:** https://agua-backend.onrender.com/api/health

## 1. Backend (API REST) — Render

### Con Blueprint (recomendado)

1. Subir el repo con el archivo `render.yaml` a GitHub.
2. En Render: **New > Blueprint** y conectar el repo `agus123e21/elaguitas`.
3. Render creará el servicio web `agua-backend`. Antes del primer deploy hay que
   completar las variables de entorno marcadas con `sync: false`:

   | Variable       | Valor                                                        |
   |----------------|--------------------------------------------------------------|
   | `DATABASE_URL` | Connection string de Supabase (`postgresql://...`)           |
   | `JWT_SECRET`   | Secreto largo y aleatorio (no debe empezar con `change_me`)  |
   | `FRONTEND_URL` | Ya viene configurado → `https://agus123e21.github.io`        |

4. Las migraciones se aplican solas (`preDeployCommand: npm run db:migrate`).
5. Si querés datos de prueba (usuarios, productos, pedidos), ejecutar una vez
   desde el **Shell** de Render:
   ```bash
   npm run db:seed
   ```

### Manual (sin Blueprint)

1. Crear un servicio web con el directorio raíz `backend`.
2. Comando de build: `npm install`
3. Comando de start: `npm start`
4. Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`,
   `NODE_ENV=production`.
5. Aplicar migraciones una vez: `npm run db:setup` (o `npm run db:migrate`).

> Nota: Render en el plan free suspende el servicio tras inactividad. El primer
> acceso a la API puede tardar ~50 s en arrancar.

## 2. Frontend (web / PWA) — GitHub Pages

El repo despliega automáticamente con GitHub Actions cada vez que se pushea a
`main` o `Arian` (workflow `.github/workflows/deploy-frontend.yml`).

### Configurar por primera vez

1. En GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Crear la variable de repositorio (Settings > Secrets and variables >
   Actions > **Variables**):
   - `VITE_API_URL` → `https://agua-backend.onrender.com/api`
3. Pushear a `Arian` (o `main`). La URL pública es:
   ```
   https://agus123e21.github.io/elaguitas/
   ```
4. La app usa `BrowserRouter` con base `/elaguitas/`; el archivo `404.html`
   generado en el build permite rutas profundas (ej. `/elaguitas/productos`).

### Notas del build

- `vite.config.js` usa `base: '/elaguitas/'` cuando la variable `GH_PAGES`
  está definida (la setea el workflow). En local y APK sigue siendo `/`.
- En producción la API se lee de `VITE_API_URL` (variable del workflow).

## 3. APK Android (Capacitor)

Requisitos: Node.js + Android Studio (JDK 17+, Android SDK).

```bash
cd frontend
npm install
# Apuntar al backend real antes de compilar:
# en el entorno de build setear VITE_API_URL=https://agua-backend.onrender.com/api
npm run apk:sync      # build web + cap sync android
npm run apk:open      # abre Android Studio
```

En Android Studio:

1. `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
2. El APK queda en `frontend/android/app/build/outputs/apk/debug/app-debug.apk`
   (o release con firma configurada).

Notas:

- Se habilitó `android:usesCleartextTraffic` para desarrollo; en producción con
  HTTPS se puede quitar.
- La aplicación usa la URL de `VITE_API_URL`; sin ella en Android apunta a `/api`
  (no funciona en el dispositivo), así que siempre configurarla para builds móviles.

## 4. Base de datos

- Migraciones: `backend/db/migrations/*.sql` (001–007).
- Seeds de prueba: `backend/db/seeds/*.sql` (solo desarrollo / primer deploy).
- En producción no ejecutar seeds; crear el usuario admin manualmente o con un
  script seguro.

## Usuarios de prueba (seeds)

| Rol        | Email              | Contraseña |
|------------|--------------------|------------|
| Admin      | admin@agua.com     | 123456     |
| Repartidor | repartidor@agua.com | 123456     |
| Cliente    | juan@cliente.com   | 123456     |
