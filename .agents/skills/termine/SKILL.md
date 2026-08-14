---
name: termine
description: Genera una documentación exhaustiva del proyecto y actualiza CONTEXT.md al finalizar una sesión de trabajo (/termine), con atribución explícita del autor/desarrollador (ej. HugoAleOlguin, Arian) y resumen de arquitectura para que cualquier IA entienda el contexto de inmediato.
---

# Workflow /termine: Documentación Integral y Actualización de Contexto

Al recibir el comando `/termine` (o cuando el usuario solicite cerrar la sesión, documentar o consolidar cambios), cualquier IA asistente debe ejecutar rigurosamente los siguientes pasos:

---

## 1. Identificar al Autor / Desarrollador
- Detectar la rama actual de git (`git branch --show-current`) o el usuario de git (`git config user.name`) o preguntar/usar el nombre indicado por el usuario (ej. `HugoAleOlguin`, `Arian`, etc.).
- Todo registro de cambios en el historial debe ir encabezado por: `**Autor / Desarrollador:** <Nombre>`.

---

## 2. Analizar y Consolidar el Trabajo de la Sesión
Revisar todo lo realizado en la sesión:
1. **Frontend / UI / UX**: Componentes creados o modificados, diseño Mobile-First, tokens de diseño, interacciones táctiles (mínimo 44px), flujos de navegación.
2. **Backend & Base de Datos**: Rutas API, controladores, middleware de autenticación, migraciones y seeds en Supabase PostgreSQL.
3. **DevOps, MCPs & Herramientas**: Integración con Vercel, Supabase poolers, Graphify, servidores MCP, dependencias instaladas.
4. **Agent Skills & Reglas**: Skills agregadas, actualizadas o depuradas, archivos de reglas (`AGENTS.md`, `graphify.md`).
5. **Decisiones Técnicas & Solución de Bugs**: Problemas encontrados (ej. códigos 401, 400, 408, ECONNREFUSED) y la solución exacta aplicada.

---

## 3. Actualizar `CONTEXT.md` en la Raíz del Proyecto
Sobrescribir y mantener al día el archivo [`CONTEXT.md`](file:///C:/Users/HuGOD777/proyectos%20practica/elaguitas/CONTEXT.md) utilizando la siguiente estructura estandarizada:

```markdown
# 💧 El Agüitas - Contexto y Memoria del Proyecto

> **Propósito:** Este archivo es la fuente única de verdad para cualquier IA asistente (Antigravity, Cursor, Claude, Copilot, Cline). Debe leerse al inicio de cada sesión para entender la arquitectura, credenciales, convenciones de diseño y estado del proyecto.

## 📌 Metadatos del Proyecto
- **Plataforma:** Fullstack Monorepo en Vercel (Express Serverless en `/api/index.js` + React 19 / Vite en `frontend/`).
- **Base de Datos:** PostgreSQL en Supabase (`aws-0-us-east-2.pooler.supabase.com:6543`).
- **Filosofía de Diseño:** **Mobile-First Estricto** (basado en `mobile-app-ui-design` y `elaguitas-ops`).

---

## 🗺️ Matriz de Roles y Rutas
| Rol | Landing Route | Funcionalidades Clave |
| :--- | :--- | :--- |
| **ADMIN** | `/admin` | Despacho de pedidos, creación de usuarios, telemetría de Supabase y visor de logs en vivo. |
| **DRIVER** | `/repartos` | Hoja de ruta móvil, botón 1-tap Google Maps GPS, WhatsApp preescrito, confirmación de envases. |
| **CLIENT** | `/productos` / `/pedidos` | Catálogo en 2 columnas, carrito flotante, checkout con cálculo automático de envases. |

---

## 📜 Historial Cronológico de Sesiones

### 🗓️ Sesión [FECHA_HORA] — Autor: [AUTOR]
- **Objetivo Principal:** [Resumen del objetivo]
- **Frontend / UI:** [Detalle de cambios visuales y componentes]
- **Backend & DB:** [Detalle de rutas, migraciones y consultas]
- **DevOps & MCPs:** [Detalle de infraestructura y herramientas]
- **Bugs Resueltos:** [Lista de errores solucionados y su causa]
- **Próximos Pasos Recomendados:** [Tareas sugeridas para la siguiente sesión]
```

---

## 4. Mantener la Integridad del Grafo Semántico (Graphify)
Si `graphify` está configurado en el proyecto, ejecutar:
```powershell
uvx --from graphifyy graphify update .
```
para mantener el grafo semántico sincronizado con los últimos cambios de código.

---

## 5. Reportar al Usuario
Mostrar un resumen claro de los archivos documentados, la atribución de autoría y confirmar que el proyecto quedó completamente listo para futuras sesiones.
