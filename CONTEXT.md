# 💧 El Agüitas - Contexto Maestro & Memoria del Proyecto

> **📌 GUÍA PARA AGENTES IA (Antigravity, Cursor, Claude, Copilot, Cline):**
> Lee este archivo **inmediatamente al iniciar una sesión**. Contiene la arquitectura completa, variables de entorno, esquema de base de datos, convenciones Mobile-First y el registro histórico de cambios. No inventes rutas ni uses patrones que contradigan este documento.

---

## 🏗️ 1. Arquitectura del Sistema (Fullstack Monorepo)

- **Plataforma de Hosting:** **Vercel** (Monorepo con frontend y backend en el mismo repositorio).
- **Backend Serverless:** Express montado en [`/api/index.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/api/index.js) que delega en [`backend/src/app.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/src/app.js).
- **Frontend SPA:** React 19 + Vite en [`frontend/`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/).
- **Base de Datos:** PostgreSQL en **Supabase** mediante Transaction Pooler (puerto `6543`) con pooling de conexiones y SSL (`rejectUnauthorized: false`).
- **Indexación Semántica:** **Graphify v0.9.43** en [`graphify-out/`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/graphify-out/) con 1.088 nodos y 82 comunidades.

---

## 🔑 2. Variables de Entorno de Producción (Vercel & Local)

| Variable | Valor / Descripción |
| :--- | :--- |
| **`DATABASE_URL`** | `postgresql://postgres.ismbevnmdrouexdvavuq:AnimeVanguarMySQL80@aws-0-us-east-2.pooler.supabase.com:6543/postgres` |
| **`JWT_SECRET`** | `elaguitas_super_secret_jwt_key_2026_x89aZqL7pM01_production_ready` |
| **`NODE_ENV`** | `production` |

---

## 👥 3. Matriz de Roles y Cuentas de Acceso en Supabase

| Rol | Email de Prueba | Password | Destino | Funcionalidad Principal |
| :--- | :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@agua.com` | `123456` | `/admin` | Despacho de pedidos, asignación de choferes, creación de usuarios, telemetría y logs de DB en vivo. |
| **🚚 DRIVER** | `repartidor@agua.com` | `123456` | `/repartos` | Hoja de ruta móvil, botón `Tomar Pedido`, GPS Google Maps, chat WhatsApp 1-tap, confirmación de envases. |
| **👤 CLIENT** | `juan@cliente.com` | `123456` | `/productos` / `/pedidos` | Catálogo mobile en 2 columnas con steppers reactivos, carrito flotante y checkout con retiro automático de envases. |

---

## 📱 4. Reglas Estrictas de Diseño Mobile-First

1. **Áreas Táctiles:** Mínimo **44px a 48px** de altura para todos los botones y campos (`.btn`, `.input`, `.select`).
2. **Navegación Móvil:** Barra de navegación inferior flotante (**Mobile Bottom Navigation Dock**) con efecto Glassmorphism (`backdrop-filter: blur(16px)`).
3. **Paleta de Colores 60 / 30 / 10:**
   - **60% Neutro:** Fondo `#f8fafc` y superficies `#ffffff`.
   - **30% Estructural:** Texto `#0f172a`, subtítulos `#64748b`, bordes `#e2e8f0`.
   - **10% Marca & Acción:** Primario `#0b7dc2` y Éxito `#10b981`.
4. **Hero Banner:** Fondo `linear-gradient(135deg, #0b7dc2 0%, #10b981 100%)` con badge flotante.
5. **Catálogo:** Cuadrícula de **2 columnas** (`.grid--products-2col`) en smartphones con badges de stock y steppers `[ - ] [ X ] [ + ]`.

---

## 📜 5. Historial Detallado de Sesiones & Cambios

### 🗓️ Sesión 2026-08-14 — Autor: **HugoAleOlguin**

#### 🎯 Objetivos Completados:
1. Conexión e inicialización total de la base de datos PostgreSQL en Supabase con 7 migraciones y 5 seeds idempotentes.
2. Rediseño completo de la interfaz de usuario bajo el estándar **Mobile-First** (`mobile-app-ui-design`).
3. Creación y despliegue del flujo operativo del repartidor con visibilidad general de pedidos, botón de auto-asignación `Tomar Pedido`, **Google Maps GPS** y **WhatsApp 1-tap**.
4. Catálogo de productos en 2 columnas con steppers reactivos `[ - ] [ X ] [ + ]`, toast animado y barra flotante de resumen.
5. Flujo de Checkout con cálculo automático de envases a retirar y eliminación del código de promoción.
6. Automatización de DevOps e indexación semántica mediante **Graphify** y manifiesto global `mcp_config.json` en UTF-8 sin BOM.
7. Creación de la skill y workflow universal `/termine` para documentación continua con atribución de autoría.

#### 📁 Archivos Creados y Modificados:
- **Frontend:**
  - [`frontend/src/index.css`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/index.css): Tokens de diseño, sistema de elevación, dock de navegación inferior, 2 columnas de catálogo y sticky footer.
  - [`frontend/src/components/Navbar.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/components/Navbar.jsx): Top bar glassmorphism y Bottom Navigation Dock adaptativo según rol.
  - [`frontend/src/pages/Catalog.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Catalog.jsx): Catálogo 2-col, steppers reactivos por producto, toast superior y floating cart dock.
  - [`frontend/src/pages/Checkout.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Checkout.jsx): Cálculo automático de bidones a retirar, selector de direcciones inline, acceso rápido si no hay sesión y remoción de cupón de descuento.
  - [`frontend/src/pages/DriverOrders.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/DriverOrders.jsx): Vista de pedidos generales, botón `Tomar Pedido`, Maps, WhatsApp y modal bottom-sheet para registrar envases.
  - [`frontend/src/pages/Login.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Login.jsx): Diseño mobile con avatar de gota, 1-click test fill chips y campos táctiles de 46px.
  - [`frontend/src/pages/admin/AdminDashboard.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/admin/AdminDashboard.jsx): Consola de despacho, gestión de usuarios, monitor de Supabase y logs en vivo.
  - [`frontend/src/services/api.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/services/api.js): Interceptor con fallback automático a `'agua_token'` y prevención de error de serialización de cuerpo `null`.
  - [`frontend/src/services/orders.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/services/orders.js): Añadida función `takeOrder(id, token)`.
  - [`frontend/public/sw.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/public/sw.js): Eliminación de error sintético 408 por fallback limpio a cache.

- **Backend & Base de Datos:**
  - [`backend/src/modules/orders/orders.routes.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/src/modules/orders/orders.routes.js): Permisos `requireAnyRole`, endpoint `/api/orders/:id/take`, visualización de pedidos para repartidores y transiciones de estado ampliadas.
  - [`backend/src/modules/orders/orders.service.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/src/modules/orders/orders.service.js): Auto-creación al vuelo de registros en `customers` y `delivery_drivers` ante usuarios nuevos.
  - [`backend/src/modules/auth/auth.routes.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/src/modules/auth/auth.routes.js): Simplificación de logout para prevenir rechazos 400.
  - [`backend/src/config/db.js`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/src/config/db.js): Timeout de conexión a 10.000ms y validación explícita de `DATABASE_URL`.
  - [`backend/db/seeds/005_orders_sample.sql`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/backend/db/seeds/005_orders_sample.sql): Semillas con cláusulas `ON CONFLICT DO NOTHING` para garantizar idempotencia total.

- **DevOps, Skills & Reglas:**
  - [`.agents/skills/mobile-app-ui-design/`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/.agents/skills/mobile-app-ui-design/): Skill de diseño de interfaces móviles de alta calidad.
  - [`.agents/skills/elaguitas-ops/SKILL.md`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/.agents/skills/elaguitas-ops/SKILL.md): Skill con lógica de negocio y directrices operativas de agua envasada.
  - [`.agents/skills/termine/SKILL.md`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/.agents/skills/termine/SKILL.md): Skill universal para cierre de sesión y generación de documentación con atribución.
  - [`.agents/workflows/termine.md`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/.agents/workflows/termine.md): Workflow ejecutable con `/termine`.
  - [`AGENTS.md`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/AGENTS.md): Regla raíz obligatoria que fuerza la prioridad Mobile-First y la lectura de `CONTEXT.md`.
  - [`graphify-out/`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/graphify-out/): Grafo semántico indexado con 1.088 nodos y mapa de arquitectura.

#### 🐛 Bugs Resueltos Durante la Sesión:
1. **`db: unreachable / ECONNREFUSED 127.0.0.1:5432`**: Corregido al configurar la variable de entorno `DATABASE_URL` en el dashboard de hosting y aumentar el timeout del pool a 10s.
2. **`401 Token no proporcionado`**: Resuelto al sincronizar la clave de almacenamiento del token (`'agua_token'`) en el interceptor `api.js` y permitir `requireAnyRole` en pedidos.
3. **`400 Logout / Unexpected token 'n', "null" is not valid JSON`**: Resuelto al evitar la serialización de cuerpos `null` en peticiones POST sin payload.
4. **`408 Network Error en Service Worker`**: Resuelto reemplazando respuestas sintéticas 408 en `sw.js` por fallbacks limpios al App Shell en caché.
5. **Constraint violation en seeds SQL**: Corregido haciendo idempotentes todas las consultas de inserción de pedidos y entregas de prueba.

### Sesión: 2026-10-20 — Rediseño Integral Mobile-First "Green-to-Green" (100% Modo Claro, Curvas Orgánicas, Cero Emojis)
- **Autor / Desarrollador Principal:** `HugoAleOlguin`
- **Asistente AI:** Antigravity (Google DeepMind)
- **Estado del Build:** 100% en verde (`built in ~480ms`). Grafo `graphify` actualizado a 1.156 nodos y 84 comunidades.

#### 🚀 Componentes y Pantallas Rediseñadas:
1. **Tokens y Curvas Globales ([`frontend/src/index.css`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/index.css)):**
   - Incorporación de variables de diseño orgánicas: `--radius-md: 24px`, `--radius-lg: 32px`, `--radius-pill: 9999px`, sombras ambientales `--shadow-soft` y `--shadow-float`.
   - Eliminación total de bordes cuadrados o rígidos en toda la aplicación.
2. **Floating Bottom Dock & Navbar Cápsula ([`frontend/src/components/Navbar.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/components/Navbar.jsx)):**
   - Dock inferior flotante con curvatura de píldora y efecto glassmorphism backdrop blur.
   - Píldoras activas con gradiente azul `#0b7dc2`, íconos SVG blancos y microinteracción táctil.
3. **Nueva Landing Home ([`frontend/src/pages/Home.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Home.jsx)):**
   - Se eliminó el catálogo invasivo en la landing page.
   - Rediseñada como Hub Operativo con:
     - Card de Seguimiento de Entrega en Vivo (con chofer asignado y enlace a Google Maps).
     - Cuadrícula táctil 2x2 (*Pedir Agua*, *Recambio Rápido*, *Retiro de Vacíos*, *Llamar*).
     - Widget de consumo mensual e histórico.
     - Sello de control bromatológico de San Rafael.
4. **Catálogo Especializado Dedicado ([`frontend/src/pages/Catalog.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Catalog.jsx)):**
   - Buscador de productos con cápsula curvada.
   - Filtros por volumen en píldoras horizontales (*Todos, 20L Retornable, 12L Compacto, Dispensadores*).
   - Tarjetas de producto ultra curvas (`border-radius: 28px`), pods visuales circulares, selectores de cantidad stepper flotantes y cápsula de checkout flotante cuando hay items en el carrito.
5. **Checkout Táctil en 1 Paso ([`frontend/src/pages/Checkout.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Checkout.jsx)):**
   - Tarjetas de 32px de curvatura con bordes suaves.
   - Panel de Envases y Retiro de Vacíos con cápsulas (*Te Entregamos* vs *Nos Llevamos*) y checkbox interactivo de primera compra.
   - Selector táctil de direcciones guardadas y validación de calle y altura en San Rafael.
   - Botón CTA de confirmación flotante con gradiente esmeralda (`#10b981`), altura 56px y curvatura de píldora.
6. **Hoja de Ruta Chofer en Modo Claro ([`frontend/src/pages/DriverOrders.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/DriverOrders.jsx)):**
   - 100% modo claro luminoso (cero fondos oscuros).
   - Botones touch mínimos de 48px para Google Maps y WhatsApp directo al cliente de San Rafael.
   - Modal Bottom Sheet con curvatura de 36px para arqueo de envases retirados y cobro en efectivo / transferencia.
7. **Consola Administrativa Unificada ([`frontend/src/pages/admin/AdminDashboard.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/admin/AdminDashboard.jsx)):**
   - Pestañas en cápsulas redondeadas (*Despacho, Usuarios, Monitor Supabase*).
   - KPI cards redondeadas con bordes luminosos.
   - Visor de logs en memoria 100% en modo claro con chips de color para `[INFO]`, `[WARN]` y `[ERROR]`.
8. **Autenticación Rápida ([`frontend/src/pages/Login.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Login.jsx) & [`Register.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Register.jsx)):**
   - Tarjetas con 32px de curvatura y ambient shadows.
   - Botones rápidos de demo con 1 clic para Admin, Repartidor y Cliente con avatares circulares e íconos SVG.
   - Cero emojis en toda la plataforma.

9. **Desduplicación del Catálogo y Simplificación de Textos:**
   - Desactivados 19 productos duplicados en Supabase (`active = false`), quedando únicamente los 6 productos oficiales únicos (IDs 1 al 6).
   - Desduplicación defensiva en el cliente dentro de `Catalog.jsx` (ignora duplicados por nombre normalizado).
   - Reemplazo y limpieza de textos genéricos/robóticos ("Camioneta San Rafael", "en planta", frases largas) por copys directos y claros.
   - Nueva vista de usuario y perfil en [`frontend/src/pages/Account.jsx`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/src/pages/Account.jsx).

10. **Adaptación Responsiva a PC (Desktop) y Fondo Semi-Animado con Patrones:**
   - **Fondo Semi-Animado:** Capa fija con patrón de micro-rejilla y micro-puntos de agua (`radial-gradient`), combinada con orbes ambientales tenues en tonos azul agua y menta animados suavemente en loop de 22s (`@keyframes ambientWaterDrift`), acelerados por hardware sin consumo de CPU.
   - **Top Navbar de Escritorio:** Menú horizontal integrado para PC con píldoras de navegación (*Inicio, Catálogo, Pedidos, Mi Cuenta* / *Consola Admin*), logo de marca y selector de San Rafael.
   - **Ocultamiento del Bottom Dock en PC:** `@media (min-width: 768px) { .mobile-bottom-nav { display: none !important; } }`.
   - **Layouts Expandidos en PC:**
     - `Home.jsx`: Grid de 2 columnas (`1.15fr 0.85fr`) con accesos rápidos y métricas a la par.
     - `Catalog.jsx`: Grid auto-fill de 4 columnas en desktop (`max-width: 1040px`).
     - `Checkout.jsx`: Grid de 2 columnas con panel de resumen financiero sticky a la derecha.
     - `DriverOrders.jsx` y `MyOrders.jsx`: Grid de 2 columnas de pedidos para visualización espaciosa en monitores.

---

## 🔮 6. Próximos Pasos Recomendados

1. **Suscripciones Recurrentes Automáticas**: Conectar la vista de suscripciones del cliente con el cron job `/api/cron/subscriptions` para autogenerar pedidos semanales.
2. **Arqueo de Caja Diario para Choferes**: Pantalla en `/admin` que desglosa el dinero en efectivo (`CASH`) recolectado por cada repartidor al final del día.
3. **Ruta Multiparada en Google Maps**: Botón único que abre los puntos de entrega del día ordenados en una sola ruta de navegación para el chofer.
4. **PWA Instalable / APK Android**: Compilación del APK nativo desde [`frontend/android`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/frontend/android) mediante Capacitor.
