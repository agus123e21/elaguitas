# Rediseño de la Interfaz de Usuario (UI) y Sistema de Diseño

Documentación técnica del rediseño completo implementado en la rama `Arian`.

---

## 1. Objetivos del Rediseño

- **Eliminar estilos inline**: Migrar todo el CSS embebido en componentes React hacia un sistema de clases CSS estructurado y centralizado.
- **Sistema de diseño consistente**: Establecer variables CSS (paleta de colores, tipografía, espaciados, sombras, radios de bordes) coherentes con la identidad de la marca (Agua - tonos azules, neutros y acentos cálidos).
- **Responsive y Mobile-First**: Garantizar una experiencia fluida tanto en navegadores de escritorio como en smartphones y en la APK Android compilada con Capacitor.
- **Nuevos componentes estructurales**: Integración de `Navbar` con menú administrativo y rol de usuario, y `Footer` global.

---

## 2. Sistema de Diseño (`frontend/src/index.css`)

El archivo `index.css` define las variables globales y utilidades:

### Variables CSS Principales:
```css
:root {
  --color-primary: #0077b6;
  --color-primary-dark: #023e8a;
  --color-primary-light: #caf0f8;
  --color-accent: #00b4d8;
  --color-accent-warm: #f77f00;
  
  --color-bg: #f8f9fa;
  --color-surface: #ffffff;
  --color-text: #212529;
  --color-text-muted: #6c757d;
  --color-border: #dee2e6;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
}
```

### Componentes y Clases Reutilizables:
- **Botones (`btn`)**: `.btn-primary`, `.btn-outline`, `.btn-danger`, `.btn-ghost`, `.btn-sm`, `.btn-lg`.
- **Tarjetas (`card`)**: Contenedores con elevación y padding homogéneo (`.card`, `.card--highlight`).
- **Tablas (`table`)**: Estilos limpios y responsivos para datos de pedidos, productos y clientes.
- **Badges de Estado (`badge`)**: Indicadores visuales por estado de pedido (`PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`).
- **Formularios (`form-control`, `form-group`)**: Inputs, selects y textareas accesibles con estados de foco y validación.
- **KPIs y Métricas**: Componentes visuales para el panel de administración (`AdminDashboard`).

---

## 3. Páginas y Componentes Actualizados

| Sección | Páginas / Componentes Modificados |
|---|---|
| **Estructura** | `App.jsx`, `Navbar.jsx`, `Footer.jsx` |
| **Públicas** | `Home.jsx`, `Catalog.jsx`, `Cart.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `NotFound.jsx`, `Promotions.jsx` |
| **Cliente** | `Checkout.jsx`, `MyOrders.jsx`, `OrderDetail.jsx`, `MyAddresses.jsx`, `Containers.jsx`, `MySubscriptions.jsx`, `Notifications.jsx` |
| **Repartidor** | `DriverOrders.jsx` |
| **Administración** | `AdminDashboard.jsx`, `AdminOrders.jsx`, `AdminProducts.jsx`, `AdminZones.jsx`, `AdminContainers.jsx`, `AdminPromotions.jsx` |

---

## 4. Submenús y Gestión de Pedidos en Admin

- **Gestión de Pedidos (`/admin/pedidos`)**:
  - Filtro por estados (`TODOS`, `PENDING`, `CONFIRMED`, etc.).
  - Cambio inmediato de estado de pedidos.
  - Asignación de choferes/repartidores (`DRIVER`).
- **Barra de Navegación (`Navbar`)**:
  - Menú dinámico según el rol (`ADMIN`, `DRIVER`, `CLIENT`, `GUEST`).
  - Submenú directo a todas las secciones de administración.
