# Graph Report - elaguitas  (2026-10-20)

## Corpus Check
- 160 files · ~218,834 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1175 nodes · 1898 edges · 86 communities (68 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `22ef33f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Code Review and Quality
- Frontend Mobile Framework
- AdminProducts.jsx
- DemoPage.jsx
- AdminDashboard.jsx
- auth.routes.js
- AdminDashboard
- app.js
- dependencies
- Icons.jsx
- dependencies
- MySubscriptions.jsx
- orders.routes.js
- AdminPromotions.jsx
- DriverOrders.jsx
- services/auth.js
- db.js
- products.routes.js
- addresses.routes.js
- containers.routes.js
- runMigrations.js
- Git Workflow and Versioning
- subscriptions.service.js
- API and Interface Design
- Promotion Routes and Services
- 💧 El Agüitas - Contexto Maestro & Memoria del Proyecto
- Workflow /termine: Documentación Integral y Actualización de Contexto
- Social Media Icons
- .oxlintrc.json
- Browser Testing with DevTools
- Vercel Deployment Config
- Deployment and Assets Guide
- Development Methodology Skills
- Project Structure and Deployment
- Project Standards and Config
- Gradle Wrapper Scripts
- Android Activity Entry
- Frontend UI Engineering
- UI Redesign Documentation
- Idea Refinement Script
- Project and Database Analysis
- Site Favicon and Logo
- Service Worker Configuration
- Launch Update
- Android Launcher Icons
- Android Foreground Icons
- Android Round Icons
- Frontend Entry Point
- Hero Image Asset
- React Framework Logo
- Context Engineering
- Incremental Implementation
- Industry-Specific Design Languages
- Performance Optimization
- Code Simplification
- Debugging and Error Recovery
- Documentation and ADRs
- Mobile App UI/UX Design Skill
- Design Process
- Planning and Task Breakdown
- ReOrder: Keep Your Regulars Ordering Direct
- Interview Me
- Codebase Index
- Idea Refine
- Process
- AdminContainers.jsx
- Refinement & Evaluation Criteria
- Ideation Frameworks Reference
- App.jsx
- El Agüitas - Operational & Domain Guidelines
- React + Vite
- rules/graphify.md
- workflows/graphify.md
- MyOrders.jsx
- /termine Workflow
- build-video.cjs
- Home.jsx
- capture.cjs

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 45 edges
2. `react` - 29 edges
3. `Code Review and Quality` - 19 edges
4. `AdminDashboard()` - 16 edges
5. `pool` - 15 edges
6. `asyncHandler()` - 15 edges
7. `Git Workflow and Versioning` - 15 edges
8. `ApiError` - 14 edges
9. `api` - 13 edges
10. `Browser Testing with DevTools` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Deployment Guide` --references--> `Android Launcher Icon`  [INFERRED]
  docs/DEPLOY.md → frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.png
- `Deployment Guide` --references--> `Android Splash Screen`  [INFERRED]
  docs/DEPLOY.md → frontend/android/app/src/main/res/drawable/splash.png
- `handler()` --calls--> `app`  [EXTRACTED]
  api/index.js → backend/src/app.js
- `Update: UI Redesign` --conceptually_related_to--> `UI Redesign Documentation`  [INFERRED]
  actualizaciones/Act_1_2v_Rediseno_UI.txt → docs/REDISENO_UI.md
- `AdminDashboard()` --indirect_call--> `ShieldIcon()`  [INFERRED]
  frontend/src/pages/admin/AdminDashboard.jsx → frontend/src/components/Icons.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Agent Engineering Workflow Skills** — agents_skills_using_agent_skills_skill, agents_skills_spec_driven_development_skill, agents_skills_test_driven_development_skill, agents_skills_source_driven_development_skill, agents_skills_security_and_hardening_skill [EXTRACTED 1.00]
- **Agua Project Core Documentation** — docs_analisis, docs_database, docs_deploy, docs_rediseno_ui [EXTRACTED 1.00]
- **Android Launcher Assets** — frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher, frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher_foreground, frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher_round [EXTRACTED 1.00]
- **Social Media Icons** — frontend_public_icons_bluesky_icon, frontend_public_icons_discord_icon, frontend_public_icons_github_icon, frontend_public_icons_x_icon [INFERRED 0.90]

## Communities (86 total, 18 thin omitted)

### Community 0 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 1 - "Frontend Mobile Framework"
Cohesion: 0.06
Nodes (35): @capacitor/android, @capacitor/cli, @capacitor/core, dependencies, @capacitor/android, @capacitor/core, react, react-dom (+27 more)

### Community 2 - "AdminProducts.jsx"
Cohesion: 0.23
Nodes (13): AdminProducts, AdminProducts(), handleImage(), handleRemove(), handleSubmit(), load(), toggleActive(), emptyForm (+5 more)

### Community 3 - "DemoPage.jsx"
Cohesion: 0.20
Nodes (8): DemoPage, Login, LockIcon(), ShieldIcon(), SparklesIcon(), TruckIcon(), UserIcon(), Login()

### Community 4 - "AdminDashboard.jsx"
Cohesion: 0.29
Nodes (7): AdminDashboard, Checkout, ClockIcon(), ROLE_BADGES, STATUS_LABELS, createOrder(), previewOrder()

### Community 5 - "auth.routes.js"
Cohesion: 0.20
Nodes (16): assertValidEnv(), env, loginRules, registerRules, findUserByEmail(), findUserById(), generateResetToken(), hashToken() (+8 more)

### Community 6 - "AdminDashboard"
Cohesion: 0.09
Nodes (36): AdminOrders, AdminDashboard(), handleAssignDriver(), handleClearLogs(), handleCreateOrder(), handleCreateUser(), handleOrderStatus(), handleToggleUserActive() (+28 more)

### Community 7 - "app.js"
Cohesion: 0.10
Nodes (21): handler(), apiLimiter, apiRouter, app, authLimiter, __dirname, uploadsPath, authenticate() (+13 more)

### Community 8 - "dependencies"
Cohesion: 0.04
Nodes (44): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken (+36 more)

### Community 9 - "Icons.jsx"
Cohesion: 0.16
Nodes (15): AlertCircleIcon(), CartIcon(), CheckIcon(), ChevronRightIcon(), MinusIcon(), PlusIcon(), ProductVisual(), SearchIcon() (+7 more)

### Community 10 - "dependencies"
Cohesion: 0.05
Nodes (43): concurrently, dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, helmet (+35 more)

### Community 11 - "MySubscriptions.jsx"
Cohesion: 0.06
Nodes (45): AdminZones, MyAddresses, MySubscriptions, Notifications, AdminZones(), handleSubmit(), handleToggle(), load() (+37 more)

### Community 12 - "orders.routes.js"
Cohesion: 0.18
Nodes (20): itemRules, orderRules, router, assertOrderStatus(), assignDriver(), changeOrderStatus(), createOrder(), getCustomerIdByUserId() (+12 more)

### Community 13 - "AdminPromotions.jsx"
Cohesion: 0.16
Nodes (17): AdminPromotions, Promotions, AdminPromotions(), handleDelete(), handleSubmit(), handleToggleActive(), load(), empty (+9 more)

### Community 14 - "DriverOrders.jsx"
Cohesion: 0.20
Nodes (14): DriverOrders, CloseIcon(), DollarSignIcon(), DropletIcon(), LogOutIcon(), MapPinIcon(), MenuIcon(), PackageIcon() (+6 more)

### Community 15 - "services/auth.js"
Cohesion: 0.15
Nodes (14): ForgotPassword, ResetPassword, ForgotPassword(), handleSubmit(), ResetPassword(), handleSubmit(), clearSession(), forgotPassword() (+6 more)

### Community 16 - "db.js"
Cohesion: 0.15
Nodes (12): __dirname, SEEDS_DIR, checkConnection(), pool, poolConfig, query(), requireAdmin, getDashboard() (+4 more)

### Community 17 - "products.routes.js"
Cohesion: 0.22
Nodes (11): __dirname, productRules, router, storage, upload, UPLOADS_DIR, createProduct(), getProductById() (+3 more)

### Community 18 - "addresses.routes.js"
Cohesion: 0.42
Nodes (7): addressRules, router, createAddress(), deleteAddress(), getAddressById(), listCustomerAddresses(), updateAddress()

### Community 19 - "containers.routes.js"
Cohesion: 0.22
Nodes (11): router, createMovement(), getCustomerMovements(), getCustomerSummary(), listInventory(), registerContainers(), updateContainerStatus(), ApiError (+3 more)

### Community 20 - "runMigrations.js"
Cohesion: 0.47
Nodes (5): __dirname, ensureMigrationsTable(), getApplied(), MIGRATIONS_DIR, runMigrations()

### Community 21 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 22 - "subscriptions.service.js"
Cohesion: 0.33
Nodes (8): router, assertFrequency(), assertStatus(), createSubscription(), FREQUENCIES, listSubscriptions(), STATUSES, updateSubscription()

### Community 23 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 24 - "Promotion Routes and Services"
Cohesion: 0.36
Nodes (7): promotionRules, router, createPromotion(), deletePromotion(), getPromotionById(), listPromotions(), updatePromotion()

### Community 25 - "💧 El Agüitas - Contexto Maestro & Memoria del Proyecto"
Cohesion: 0.10
Nodes (17): 🏗️ 1. Arquitectura del Sistema (Fullstack Monorepo), 🔑 2. Variables de Entorno de Producción (Vercel & Local), 👥 3. Matriz de Roles y Cuentas de Acceso en Supabase, 📱 4. Reglas Estrictas de Diseño Mobile-First, 📜 5. Historial Detallado de Sesiones & Cambios, 🔮 6. Próximos Pasos Recomendados, 📁 Archivos Creados y Modificados:, 🐛 Bugs Resueltos Durante la Sesión: (+9 more)

### Community 26 - "Workflow /termine: Documentación Integral y Actualización de Contexto"
Cohesion: 0.29
Nodes (6): 1. Identificar al Autor / Desarrollador, 2. Analizar y Consolidar el Trabajo de la Sesión, 3. Actualizar `CONTEXT.md` en la Raíz del Proyecto, 4. Mantener la Integridad del Grafo Semántico (Graphify), 5. Reportar al Usuario, Workflow /termine: Documentación Integral y Actualización de Contexto

### Community 27 - "Social Media Icons"
Cohesion: 0.29
Nodes (7): Icon Library, Bluesky Icon, Discord Icon, Documentation Icon, GitHub Icon, Social Icon, X Icon

### Community 28 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 29 - "Browser Testing with DevTools"
Cohesion: 0.08
Nodes (24): Accessibility Verification with DevTools, Available Tools, Browser Testing with DevTools, Clean Console Standard, Common Rationalizations, Console Analysis Patterns, Content Boundary Markers, For Network Issues (+16 more)

### Community 30 - "Vercel Deployment Config"
Cohesion: 0.33
Nodes (5): buildCommand, crons, outputDirectory, rewrites, version

### Community 31 - "Deployment and Assets Guide"
Cohesion: 0.40
Nodes (5): Update: Vercel Monorepo, Deployment Guide, Android Launcher Icon, Android Splash Screen, Deploy Frontend Workflow

### Community 32 - "Development Methodology Skills"
Cohesion: 0.60
Nodes (5): Security and Hardening Skill, Source-Driven Development Skill, Spec-Driven Development Skill, Test-Driven Development Skill, Using Agent Skills Meta-Skill

### Community 35 - "Gradle Wrapper Scripts"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 37 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (23): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+15 more)

### Community 58 - "Context Engineering"
Cohesion: 0.09
Nodes (22): Anti-Patterns, Common Rationalizations, Confusion Management, Context Engineering, Context Packing Strategies, Level 1: Rules Files, Level 2: Specs and Architecture, Level 3: Relevant Source Files (+14 more)

### Community 59 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 60 - "Industry-Specific Design Languages"
Cohesion: 0.09
Nodes (22): AI / Tech Products, Applying Peak-End to Mobile Apps, Crypto / Web3, Design Process for Client/Product Work, E-commerce / Food, Education / Learning, Emotional Design Principles, Emotional Feedback Loops (+14 more)

### Community 61 - "Performance Optimization"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Core Web Vitals Targets, Large Bundle Size, Log every attempt, including the reverted ones, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Overview (+14 more)

### Community 62 - "Code Simplification"
Cohesion: 0.09
Nodes (21): 1. Preserve Behavior Exactly, 2. Follow Project Conventions, 3. Prefer Clarity Over Cleverness, 4. Maintain Balance, 5. Scope to What Changed, Code Simplification, Common Rationalizations, Language-Specific Guidance (+13 more)

### Community 63 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 64 - "Documentation and ADRs"
Cohesion: 0.09
Nodes (21): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+13 more)

### Community 65 - "Mobile App UI/UX Design Skill"
Cohesion: 0.09
Nodes (21): Contributing, Core Philosophy, Credits, Design Principles, Direct Download, Examples, Features, File Structure (+13 more)

### Community 66 - "Design Process"
Cohesion: 0.09
Nodes (21): Anti-Patterns to Avoid, Category Screens, Color System (60/30/10 Rule), Core Philosophy, Design Process, Implementation Notes, Mobile App UI/UX Design Skill, Order/Status Tracking (+13 more)

### Community 67 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 68 - "ReOrder: Keep Your Regulars Ordering Direct"
Cohesion: 0.11
Nodes (17): Example 1: Vague Early-Stage Concept (Full 3-Phase Session), Example 2: Feature Idea Within an Existing Product (Codebase-Aware), Example 3: Process/Workflow Idea (Non-Product), Ideation Session Examples, Key Assumptions to Validate, MVP Scope, Not Doing (and Why), Open Questions (+9 more)

### Community 69 - "Interview Me"
Cohesion: 0.11
Nodes (17): Common Rationalizations, Example, Interaction with Other Skills, Interview Me, Loading Constraints, Output, Overview, Red Flags (+9 more)

### Community 70 - "Codebase Index"
Cohesion: 0.12
Nodes (15): Codebase Index, Core Design Framework, Design Laws Applied, Design Principles Summary:, File Structure, Implementation Tech Stack, Key Insights:, Key Sections: (+7 more)

### Community 71 - "Idea Refine"
Cohesion: 0.13
Nodes (14): Anti-patterns to Avoid, Detailed Instructions, How It Works, Idea Refine, Output, Phase 1: Understand & Expand (Divergent), Phase 2: Evaluate & Converge, Phase 3: Sharpen & Ship (+6 more)

### Community 72 - "Process"
Cohesion: 0.13
Nodes (14): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+6 more)

### Community 73 - "AdminContainers.jsx"
Cohesion: 0.19
Nodes (16): AdminContainers, Containers, AdminContainers(), handleAdjust(), handleRegister(), handleStatus(), load(), STATUS_LABELS (+8 more)

### Community 74 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 75 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 76 - "App.jsx"
Cohesion: 0.10
Nodes (20): Account, App(), Catalog, NotFound, OrderDetail, Register, Footer(), Navbar() (+12 more)

### Community 77 - "El Agüitas - Operational & Domain Guidelines"
Cohesion: 0.33
Nodes (5): 1. Project Architecture (Fullstack Monorepo), 2. Core User Roles & Routing Matrix, 3. Order Lifecycle & Status Progression, 4. Mobile-First UX Guidelines for Driver Screens, El Agüitas - Operational & Domain Guidelines

### Community 78 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 81 - "MyOrders.jsx"
Cohesion: 0.29
Nodes (9): MyOrders, ShoppingBagIcon(), formatPrice(), MyOrders(), handleRepeat(), load(), showSuccess(), STATUS_LABELS (+1 more)

### Community 83 - "build-video.cjs"
Cohesion: 0.25
Nodes (7): { execSync }, ffmpegCmd, filterComplex, fs, musicPath, outputFile, path

### Community 84 - "Home.jsx"
Cohesion: 0.20
Nodes (13): Cart, Home, CartContext, CartProvider(), loadCart(), useCart(), Cart(), formatPrice() (+5 more)

### Community 85 - "capture.cjs"
Cohesion: 0.50
Nodes (3): { execSync }, htmlPath, path

## Knowledge Gaps
- **544 isolated node(s):** `idea-refine.sh script`, `__dirname`, `MIGRATIONS_DIR`, `__dirname`, `SEEDS_DIR` (+539 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `App.jsx` to `AdminProducts.jsx`, `DemoPage.jsx`, `AdminDashboard.jsx`, `AdminDashboard`, `AdminContainers.jsx`, `Icons.jsx`, `MySubscriptions.jsx`, `AdminPromotions.jsx`, `DriverOrders.jsx`, `MyOrders.jsx`, `Home.jsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `AdminProducts.jsx`, `DemoPage.jsx`, `AdminDashboard.jsx`, `AdminDashboard`, `AdminContainers.jsx`, `Icons.jsx`, `MySubscriptions.jsx`, `AdminPromotions.jsx`, `DriverOrders.jsx`, `services/auth.js`, `MyOrders.jsx`, `Home.jsx`, `.oxlintrc.json`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `AdminDashboard()` connect `AdminDashboard` to `DemoPage.jsx`, `AdminDashboard.jsx`, `DriverOrders.jsx`, `App.jsx`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `AdminDashboard()` (e.g. with `PackageIcon()` and `ShieldIcon()`) actually correct?**
  _`AdminDashboard()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `idea-refine.sh script`, `__dirname`, `MIGRATIONS_DIR` to the rest of the system?**
  _544 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Code Review and Quality` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Frontend Mobile Framework` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._