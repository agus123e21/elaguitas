---
name: elaguitas-ops
description: Comprehensive operational, business logic, and mobile-first guidelines for the El Agüitas platform (Vercel Fullstack + Supabase PostgreSQL + Driver Route Optimization + Admin Console). Use whenever developing or modifying features related to water bottle distribution, driver delivery flows, customer orders, bottle returns, roles, or database operations.
---

# El Agüitas - Operational & Domain Guidelines

## 1. Project Architecture (Fullstack Monorepo)

- **Platform**: Vercel Serverless (`/api/index.js` mounts Express backend).
- **Database**: PostgreSQL on Supabase (`DATABASE_URL`).
- **Frontend**: React 19 + Vite (`frontend/`).
- **Design Paradigm**: **Mobile-First Priority**. The primary operational interface is used by drivers on smartphones in the field.

---

## 2. Core User Roles & Routing Matrix

| Role | DB Name | Landing Route | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin / Dev** | `ADMIN` | `/admin` | Dispatching orders, driver assignment, creating users in Supabase, DB latency & system logs monitor |
| **Repartidor** | `DRIVER` | `/repartos` | Mobile-first daily delivery route, Google Maps GPS navigation, 1-click WhatsApp customer chat, delivery confirmation |
| **Cliente** | `CLIENT` | `/pedidos` / `/productos` | Catalog viewing, order history, recurring deliveries |

---

## 3. Order Lifecycle & Status Progression

```
[PENDING] ──(Admin Assigns/Dispatches)──> [OUT_FOR_DELIVERY] ──(Driver Confirms)──> [DELIVERED]
   │                                              │
   └───────────────(Cancellation)─────────────────┴───────────────────────────────> [CANCELLED]
```

1. **`PENDING`**: Order registered, awaiting vehicle assignment.
2. **`OUT_FOR_DELIVERY`**: Assigned to driver, currently in transit.
3. **`DELIVERED`**: Driver confirmed physical delivery, received payment, and registered returned empty bottles.
4. **`CANCELLED`**: Order aborted before completion.

---

## 4. Mobile-First UX Guidelines for Driver Screens

1. **Touch Targets**: All primary action buttons (`Google Maps`, `WhatsApp`, `Llamar`, `Iniciar Viaje`, `Confirmar Entrega`) must have a minimum tap height of `44px` with ample padding.
2. **One-Tap Integrations**:
   - **Google Maps**: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
   - **WhatsApp**: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
   - **Phone**: `tel:${phone}`
3. **High-Contrast Readability**: Legible in direct sunlight during deliveries (strong font weights, clear badge colors, minimal friction).
4. **Offline Resilience**: Service worker caching for essential assets and error handling so the UI never crashes without connection.
