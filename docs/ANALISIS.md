# Análisis del proyecto — Agua

## 1. Objetivo de la aplicación

Plataforma web + móvil (PWA/APK) para la venta y reparto de agua en bidones.
Permite al cliente pedir bidones de agua, suscribirse a entregas recurrentes,
y a la empresa gestionar productos, pedidos, repartidores, bidones y promociones.

## 2. Tipos de usuarios

| Rol     | Descripción |
|---------|-------------|
| CLIENT  | Compra productos, crea pedidos, gestiona direcciones y suscripciones. |
| DRIVER  | Repartidor: ve pedidos asignados, los entrega y registra movimientos de bidones. |
| ADMIN   | Gestiona productos, clientes, pedidos, repartidores, stock, bidones, promociones, zonas y estadísticas. |

## 3. Funcionalidades principales

### Cliente
- Registro / inicio de sesión.
- Gestión de datos personales y direcciones (múltiples direcciones, dirección principal, GPS).
- Catálogo de productos y agregar al carrito.
- Crear y consultar pedidos, repetir pedidos.
- Suscripciones recurrentes (cada 3/7/15/30 días).
- Ver promociones.
- Recibir notificaciones internas del estado de sus pedidos.

### Repartidor
- Ver pedidos asignados, dirección y detalle.
- Cambiar estado del pedido y marcar entregado.
- Registrar bidones retirados.
- Contactar al cliente.

### Administrador
- CRUD de productos, clientes, repartidores y promociones.
- Gestión de pedidos, stock y bidones.
- Gestión de zonas de reparto (costo de envío por zona).
- Asignación de pedidos a repartidores.
- Estadísticas reales desde la API.

## 4. Flujo de pedidos

```
Producto → Carrito → Confirmación → Dirección → Método de pago → Pedido
```

Estados de pedido: `PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`, más `CANCELLED`.

En cada pedido se registran bidones a entregar y a retirar, manteniendo un
historial de movimientos por cliente.

## 5. Estructura de datos

Relacional, con las tablas:

```
users, roles, customers, delivery_drivers, addresses, products, orders,
order_items, payments, subscriptions, deliveries, containers,
container_movements, promotions, delivery_zones, notifications
```

Regla: no guardar datos redundantes. Un pedido relaciona usuario y productos
vía `order_items`, nunca como JSON gigante.

## 6. Arquitectura general

- **Frontend**: SPA React + Vite. Consume la API REST del backend. Se convertirá en PWA y luego en APK con Capacitor.
- **Backend**: API REST en Node.js + Express. Autenticación propia con JWT y roles.
- **Base de datos**: PostgreSQL en la nube (Supabase).
- Comunicación: JSON sobre HTTP, proxy en desarrollo (`/api` → backend).

## 7. Tecnologías

| Capa       | Tecnología |
|------------|------------|
| Frontend   | React 18, Vite, React Router, CSS plano / módulos |
| Backend    | Node.js, Express, JWT (jsonwebtoken), bcrypt |
| Base datos | PostgreSQL (Supabase) vía `pg` |
| Migraciones| Scripts SQL + runner propio (`node-pg-migrate`) |
| Movil      | Capacitor (Fase 16) |
| Test       | Vitest / Supertest (Fase 18) |

## 8. Estructura de carpetas

```
Agua/
├── backend/
│   ├── src/
│   │   ├── config/       # env, db
│   │   ├── middlewares/  # auth, authorize, error, validate
│   │   ├── modules/      # auth, products, orders, ...
│   │   │   └── <modulo>/ # routes, controllers, services, validators
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── db/
│   │   ├── migrations/   # SQL versionado
│   │   └── seeds/        # datos de prueba
│   └── package.json
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/     # cliente API
│       ├── hooks/
│       ├── context/      # auth, cart
│       └── main.jsx
├── docs/
├── README.md
└── .gitignore
```

## 9. Convenciones de código

- JavaScript moderno, módulos ESM (`"type": "module"`).
- Nombres de archivos en camelCase (`productService.js`) y componentes en PascalCase.
- API REST: rutas en plural (`/api/products`), verbos HTTP correctos, códigos de estado estándar.
- Respuestas de error uniformes: `{ error: { code, message, details? } }`.
- Roles en mayúsculas (`CLIENT`, `DRIVER`, `ADMIN`).
- Estados en mayúsculas (`PENDING`, `CONFIRMED`, ...).
- No se agregan comentarios salvo que aporten valor real.
- Validación de entrada en toda ruta con datos del cliente.

## 10. Reglas de proceso

En cada fase:
1. Analizar código existente.
2. Planificar cambios.
3. Implementar.
4. Ejecutar/build.
5. Corregir errores.
6. Probar funcionalidad.
7. Verificar que no se rompió lo anterior.
8. Documentar.
9. Pasar a la siguiente fase.

Nunca modificar funcionalidad existente sin entender cómo está implementada.
