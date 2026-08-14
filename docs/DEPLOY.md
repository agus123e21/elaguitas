# Despliegue

Guía para poner el proyecto en producción y compilar el APK Android.

## 1. Backend (API REST)

Recomendado: Render, Railway o Fly.io. Requiere una base PostgreSQL pública
(Supabase ya es cloud).

Pasos:

1. Crear un servicio web con el directorio raíz `backend`.
2. Comando de build: `npm install`
3. Comando de start: `npm start`
4. Variables de entorno:
   - `DATABASE_URL` → connection string de Supabase
   - `JWT_SECRET` → secreto largo y aleatorio
   - `FRONTEND_URL` → URL del frontend en producción
   - `NODE_ENV=production`
5. Crear migraciones y seeds una vez: `npm run db:setup` (o aplicarlas
   manualmente contra la BD).

## 2. Frontend (web / PWA)

Recomendado: Vercel o Netlify.

1. Directorio raíz `frontend`, comando de build `npm run build`, directorio de
   salida `dist`.
2. En producción la API debe ser alcanzable. Dos opciones:
   - Setear `VITE_API_URL` con la URL del backend
     (ej. `https://api.tudominio.com/api`), o
   - Redirigir `/api/*` del dominio hacia el backend.
3. El `service worker` y `manifest.webmanifest` se sirven desde `dist/` para
   habilitar la PWA.

## 3. APK Android (Capacitor)

Requisitos: Node.js + Android Studio (JDK 17+, Android SDK).

```bash
cd frontend
npm install
# Apuntar al backend real antes de compilar:
# en el entorno de build setear VITE_API_URL=https://api.tudominio.com/api
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
- Seeds de prueba: `backend/db/seeds/*.sql` (solo desarrollo).
- En producción no ejecutar seeds; crear el usuario admin manualmente o con un
  script seguro.
