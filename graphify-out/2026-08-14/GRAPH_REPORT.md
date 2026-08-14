# Graph Report - elaguitas  (2026-08-14)

## Corpus Check
- 151 files · ~92,604 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1085 nodes · 1647 edges · 81 communities (64 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.58)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8107d0a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Code Review and Quality
- Frontend Mobile Framework
- AdminProducts.jsx
- useAuth
- Notifications.jsx
- auth.routes.js
- AdminDashboard.jsx
- app.js
- dependencies
- App.jsx
- dependencies
- Checkout.jsx
- orders.service.js
- Promotion Management
- Container Inventory Management
- services/auth.js
- db.js
- products.routes.js
- Subscription Management
- addresses.routes.js
- containers.routes.js
- Git Workflow and Versioning
- subscriptions.service.js
- API and Interface Design
- Promotion Routes and Services
- Android Unit Tests
- MyOrders.jsx
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
- Catalog.jsx
- Refinement & Evaluation Criteria
- Ideation Frameworks Reference
- AdminZones.jsx
- El Agüitas - Operational & Domain Guidelines
- React + Vite
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 41 edges
2. `react` - 26 edges
3. `Code Review and Quality` - 19 edges
4. `pool` - 15 edges
5. `asyncHandler()` - 15 edges
6. `Git Workflow and Versioning` - 15 edges
7. `ApiError` - 14 edges
8. `api` - 14 edges
9. `AdminDashboard()` - 13 edges
10. `Browser Testing with DevTools` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Deployment Guide` --references--> `Android Launcher Icon`  [INFERRED]
  docs/DEPLOY.md → frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.png
- `Deployment Guide` --references--> `Android Splash Screen`  [INFERRED]
  docs/DEPLOY.md → frontend/android/app/src/main/res/drawable/splash.png
- `Update: UI Redesign` --conceptually_related_to--> `UI Redesign Documentation`  [INFERRED]
  actualizaciones/Act_1_2v_Rediseno_UI.txt → docs/REDISENO_UI.md
- `Favicon` --semantically_similar_to--> `Vite Logo`  [INFERRED] [semantically similar]
  frontend/public/favicon.svg → frontend/src/assets/vite.svg
- `Deployment Guide` --references--> `Deploy Frontend Workflow`  [EXTRACTED]
  docs/DEPLOY.md → .github/workflows/deploy-frontend.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Agent Engineering Workflow Skills** — agents_skills_using_agent_skills_skill, agents_skills_spec_driven_development_skill, agents_skills_test_driven_development_skill, agents_skills_source_driven_development_skill, agents_skills_security_and_hardening_skill [EXTRACTED 1.00]
- **Agua Project Core Documentation** — docs_analisis, docs_database, docs_deploy, docs_rediseno_ui [EXTRACTED 1.00]
- **Android Launcher Assets** — frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher, frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher_foreground, frontend_android_app_src_main_res_mipmap_xxhdpi_ic_launcher_round [EXTRACTED 1.00]
- **Social Media Icons** — frontend_public_icons_bluesky_icon, frontend_public_icons_discord_icon, frontend_public_icons_github_icon, frontend_public_icons_x_icon [INFERRED 0.90]

## Communities (81 total, 17 thin omitted)

### Community 0 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 1 - "Frontend Mobile Framework"
Cohesion: 0.06
Nodes (35): @capacitor/android, @capacitor/cli, @capacitor/core, dependencies, @capacitor/android, @capacitor/core, react, react-dom (+27 more)

### Community 2 - "AdminProducts.jsx"
Cohesion: 0.23
Nodes (13): AdminProducts, AdminProducts(), handleImage(), handleRemove(), handleSubmit(), load(), toggleActive(), emptyForm (+5 more)

### Community 3 - "useAuth"
Cohesion: 0.12
Nodes (15): Home, Login, OrderDetail, Navbar(), ProtectedRoute(), AuthContext, AuthProvider(), useAuth() (+7 more)

### Community 4 - "Notifications.jsx"
Cohesion: 0.38
Nodes (8): Notifications, Notifications(), handleRead(), handleReadAll(), load(), getNotifications(), markAllNotificationsRead(), markNotificationRead()

### Community 5 - "auth.routes.js"
Cohesion: 0.17
Nodes (18): env, authenticate(), errorHandler(), notFoundHandler(), loginRules, registerRules, router, findUserByEmail() (+10 more)

### Community 6 - "AdminDashboard.jsx"
Cohesion: 0.07
Nodes (41): AdminDashboard, AdminOrders, AdminDashboard(), handleAssignDriver(), handleClearLogs(), handleCreateOrder(), handleCreateUser(), handleOrderStatus() (+33 more)

### Community 7 - "app.js"
Cohesion: 0.13
Nodes (18): apiLimiter, app, authLimiter, __dirname, uploadsPath, requireAdmin, requireAnyRole, requireDriver (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.04
Nodes (44): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken (+36 more)

### Community 9 - "App.jsx"
Cohesion: 0.16
Nodes (10): App(), Checkout, DriverOrders, ForgotPassword, NotFound, Register, ResetPassword, Footer() (+2 more)

### Community 10 - "dependencies"
Cohesion: 0.05
Nodes (43): concurrently, dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, helmet (+35 more)

### Community 11 - "Checkout.jsx"
Cohesion: 0.19
Nodes (17): MyAddresses, Checkout(), handleNewAddress(), formatPrice(), emptyForm, formatPrice(), MyAddresses(), handleDelete() (+9 more)

### Community 12 - "orders.service.js"
Cohesion: 0.19
Nodes (19): itemRules, orderRules, assertOrderStatus(), assignDriver(), changeOrderStatus(), createOrder(), getCustomerIdByUserId(), getDriverIdByUserId() (+11 more)

### Community 13 - "Promotion Management"
Cohesion: 0.16
Nodes (17): AdminPromotions, Promotions, AdminPromotions(), handleDelete(), handleSubmit(), handleToggleActive(), load(), empty (+9 more)

### Community 14 - "Container Inventory Management"
Cohesion: 0.19
Nodes (16): AdminContainers, Containers, AdminContainers(), handleAdjust(), handleRegister(), handleStatus(), load(), STATUS_LABELS (+8 more)

### Community 15 - "services/auth.js"
Cohesion: 0.17
Nodes (12): ForgotPassword(), handleSubmit(), ResetPassword(), handleSubmit(), clearSession(), forgotPassword(), getStoredToken(), login() (+4 more)

### Community 16 - "db.js"
Cohesion: 0.18
Nodes (11): __dirname, ensureMigrationsTable(), getApplied(), MIGRATIONS_DIR, runMigrations(), __dirname, SEEDS_DIR, checkConnection() (+3 more)

### Community 17 - "products.routes.js"
Cohesion: 0.22
Nodes (11): __dirname, productRules, router, storage, upload, UPLOADS_DIR, createProduct(), getProductById() (+3 more)

### Community 18 - "Subscription Management"
Cohesion: 0.29
Nodes (10): MySubscriptions, FREQUENCIES, MySubscriptions(), handleChange(), handleCreate(), load(), STATUS_LABELS, createSubscription() (+2 more)

### Community 19 - "addresses.routes.js"
Cohesion: 0.17
Nodes (13): addressRules, router, createAddress(), deleteAddress(), getAddressById(), listCustomerAddresses(), updateAddress(), ApiError (+5 more)

### Community 20 - "containers.routes.js"
Cohesion: 0.39
Nodes (7): router, createMovement(), getCustomerMovements(), getCustomerSummary(), listInventory(), registerContainers(), updateContainerStatus()

### Community 21 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 22 - "subscriptions.service.js"
Cohesion: 0.21
Nodes (12): assertValidEnv(), requireClient, router, assertFrequency(), assertStatus(), createSubscription(), FREQUENCIES, listSubscriptions() (+4 more)

### Community 23 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 24 - "Promotion Routes and Services"
Cohesion: 0.36
Nodes (7): promotionRules, router, createPromotion(), deletePromotion(), getPromotionById(), listPromotions(), updatePromotion()

### Community 25 - "Android Unit Tests"
Cohesion: 0.36
Nodes (4): ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 26 - "MyOrders.jsx"
Cohesion: 0.33
Nodes (8): MyOrders, formatPrice(), MyOrders(), handleRepeat(), load(), STATUS_LABELS, getMyOrders(), repeatOrder()

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

### Community 73 - "Catalog.jsx"
Cohesion: 0.21
Nodes (11): Cart, Catalog, CartContext, CartProvider(), loadCart(), useCart(), Cart(), formatPrice() (+3 more)

### Community 74 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 75 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 76 - "AdminZones.jsx"
Cohesion: 0.36
Nodes (8): AdminZones, AdminZones(), handleSubmit(), handleToggle(), load(), formatPrice(), createZone(), updateZone()

### Community 77 - "El Agüitas - Operational & Domain Guidelines"
Cohesion: 0.33
Nodes (5): 1. Project Architecture (Fullstack Monorepo), 2. Core User Roles & Routing Matrix, 3. Order Lifecycle & Status Progression, 4. Mobile-First UX Guidelines for Driver Screens, El Agüitas - Operational & Domain Guidelines

### Community 78 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **518 isolated node(s):** `idea-refine.sh script`, `__dirname`, `MIGRATIONS_DIR`, `__dirname`, `SEEDS_DIR` (+513 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `useAuth` to `AdminProducts.jsx`, `Notifications.jsx`, `AdminDashboard.jsx`, `Catalog.jsx`, `App.jsx`, `Checkout.jsx`, `AdminZones.jsx`, `Promotion Management`, `Container Inventory Management`, `Subscription Management`, `MyOrders.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `AdminProducts.jsx`, `useAuth`, `Notifications.jsx`, `AdminDashboard.jsx`, `Catalog.jsx`, `Checkout.jsx`, `AdminZones.jsx`, `Promotion Management`, `Container Inventory Management`, `Subscription Management`, `MyOrders.jsx`, `.oxlintrc.json`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `App.jsx`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `idea-refine.sh script`, `__dirname`, `MIGRATIONS_DIR` to the rest of the system?**
  _518 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Code Review and Quality` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Frontend Mobile Framework` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._