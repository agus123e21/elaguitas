# El Agüitas - Project Guidelines & Rules

## 📱 Mobile-First Priority Rule
**All user-facing views and operational components in this project must be designed and optimized Mobile-First.**
- Delivery drivers and mobile users are the primary field operators.
- Default viewports, card layouts, touch target sizes (min 44px height), and visual hierarchy must prioritize mobile screens before scaling to desktop.
- When designing UI components, flows, and interactive mockups, invoke and prioritize the **`mobile-app-ui-design`** skill and **`elaguitas-ops`** skill.

---

## 🎨 Design System & Visual Identity
- Use exclusively the tokens defined in `frontend/src/index.css`:
  - Primary: `#0b7dc2` / Dark: `#075a8c` / Light: `#eaf4fb`
  - Accent: `#10b981`
  - Surface: `#ffffff` / Background: `#f8fafc` / Text: `#0f172a`
  - Elevation: Modern layered shadows (`--shadow-xs`, `--shadow`, `--shadow-md`, `--shadow-lg`, `--shadow-hover`).
- Navbar must maintain glassmorphism (`backdrop-filter: blur(14px)`).
- Sticky footer must remain pinned to the bottom of the viewport on all pages.

---

## 🗄️ Fullstack Vercel + Supabase Architecture
- Frontend and backend live in the same monorepo.
- Backend routes are exposed via `/api/index.js` as Vercel Serverless Functions.
- All database queries use PostgreSQL via Supabase connection pooling.
- Keep migrations and seeds in `backend/db/migrations/` and `backend/db/seeds/`.
