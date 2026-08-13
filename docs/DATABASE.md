# Base de datos — Agua

PostgreSQL en la nube (Supabase). Migraciones y seeds en `backend/db/`.

## Esquema

```
roles
users ── role_id
├── customers ────── addresses ── delivery_zone_id ── delivery_zones
├── delivery_drivers
└── (notificaciones por user_id)

products
orders ── customer_id, address_id, driver_id
├── order_items ── product_id
├── payments
├── deliveries ── driver_id
├── containers / container_movements ── customer_id, order_id

subscriptions ── customer_id, address_id, product_id
promotions
notifications ── user_id
```

## Tablas principales

| Tabla | Propósito |
|-------|-----------|
| `roles` | CLIENT / DRIVER / ADMIN |
| `users` | Credenciales y datos base de todos los usuarios |
| `customers` | Perfil específico del cliente |
| `delivery_drivers` | Perfil del repartidor (vehículo) |
| `addresses` | Direcciones por cliente, con GPS y zona |
| `delivery_zones` | Zonas con costo de envío |
| `products` | Catálogo (precio, stock, activo) |
| `orders` | Pedidos con estados y totales |
| `order_items` | Líneas del pedido (producto + cantidad) |
| `payments` | Pagos por pedido |
| `deliveries` | Entrega asignada por pedido/repartidor |
| `containers` | Inventario físico de bidones |
| `container_movements` | Historial de entregas/retiros por cliente |
| `subscriptions` | Pedidos recurrentes |
| `promotions` | Descuentos (%, monto fijo, envío gratis, pack) |
| `notifications` | Avisos internos por usuario |

## Estados

- **Pedidos**: PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
- **Entregas**: ASSIGNED, IN_TRANSIT, DELIVERED, FAILED
- **Pagos**: PENDING, PAID, FAILED, REFUNDED
- **Suscripciones**: ACTIVE, PAUSED, CANCELLED
- **Bidones**: IN_STOCK, WITH_CUSTOMER, DAMAGED, RETIRED

## Comandos

```bash
cd backend
npm run db:migrate   # aplica migraciones pendientes (db/migrations/*.sql)
npm run db:seed      # carga datos de prueba (db/seeds/*.sql)
npm run db:setup     # ambas
```

Las migraciones se registran en la tabla `schema_migrations` y se aplican en
transacción. `updated_at` se mantiene automáticamente vía trigger.

## Datos de prueba

Todos los usuarios de prueba usan la contraseña `123456`:

| Rol | Email |
|-----|-------|
| Admin | admin@agua.com |
| Repartidor | repartidor@agua.com |
| Repartidor | repartidor2@agua.com |
| Cliente | juan@cliente.com |
| Cliente | maria@cliente.com |
| Cliente | pedro@cliente.com |

Se siembran 6 pedidos en distintos estados, 4 movimientos de bidones,
3 notificaciones, 2 suscripciones y 4 promociones.
