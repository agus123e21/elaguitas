# El Agüitas - Project Guidelines & AI Agent Rules

## 🧠 Master Context & Project Memory Rule
**Every AI coding assistant (Antigravity, Cursor, Claude, Copilot, Cline, Aider) MUST read [`CONTEXT.md`](./CONTEXT.md) at the beginning of any session.**
- [`CONTEXT.md`](./CONTEXT.md) is the single source of truth for architecture, credentials, DB connection, role routing, and historical changelog.
- When closing a task or session upon user request, invoke the **`/termine`** workflow to update [`CONTEXT.md`](./CONTEXT.md) and record the developer's attribution (e.g. `HugoAleOlguin`, `Arian`).

---

## 📱 Mobile-First Priority Rule
**All user-facing views and operational components in this project must be designed and optimized Mobile-First.**
- Delivery drivers and mobile users are the primary field operators.
- Default viewports, card layouts, touch target sizes (min 44px to 48px height), and visual hierarchy must prioritize mobile screens before scaling to desktop.
- When designing UI components, flows, and interactive mockups, invoke and prioritize the **`mobile-app-ui-design`** skill and **`elaguitas-ops`** skill.

---

## 🎨 Design System & Visual Identity
- Use exclusively the tokens defined in [`frontend/src/index.css`](./frontend/src/index.css):
  - Primary: `#0b7dc2` / Dark: `#075a8c` / Light: `#eaf4fb`
  - Accent / Success: `#10b981` / Light: `#ecfdf5`
  - Surface: `#ffffff` / Background: `#f8fafc` / Text: `#0f172a`
  - Elevation: Modern layered shadows (`--shadow-xs`, `--shadow`, `--shadow-md`, `--shadow-lg`, `--shadow-hover`).
- Navbar must maintain glassmorphism (`backdrop-filter: blur(14px)`).
- Sticky footer must remain pinned to the bottom of the viewport on desktop and switch to the **Mobile Bottom Navigation Dock** on mobile screens.

---

## 🗄️ Fullstack Vercel + Supabase Architecture
- Frontend and backend live in the same monorepo.
- Backend routes are exposed via [`/api/index.js`](./api/index.js) as Vercel Serverless Functions.
- All database queries use PostgreSQL via Supabase connection pooling (`aws-0-us-east-2.pooler.supabase.com:6543`).
- Keep migrations and seeds in [`backend/db/migrations/`](./backend/db/migrations/) and [`backend/db/seeds/`](./backend/db/seeds/).
