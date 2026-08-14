# Graph Report - elaguitas  (2026-08-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 609 nodes · 1203 edges · 58 communities (42 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.58)
- Token cost: 1,652 input · 599 output

## Graph Freshness
- Built from commit: `e8107d0a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Backend Dependencies
- Frontend Mobile Framework
- Product and Cart Management
- Auth and Navigation Components
- Admin Zones and Notifications
- Environment and Auth Logic
- Admin Dashboard Operations
- Server Entry and Middleware
- Backend Configuration and Testing
- Order Management Views
- Project Scripts and Build
- Checkout and Address Management
- Order Business Logic
- Promotion Management
- Container Inventory Management
- Password Recovery and Session
- Database Migrations and Seeds
- Product Routes and Services
- Subscription Management
- Validation and Error Handling
- Container Logistics Routes
- Logging and Async Utilities
- Subscription Routes and Services
- Address Routes and Services
- Promotion Routes and Services
- Android Unit Tests
- Customer Order History
- Social Media Icons
- Linting Configuration
- Order Detail View
- Vercel Deployment Config
- Deployment and Assets Guide
- Development Methodology Skills
- Project Structure and Deployment
- Project Standards and Config
- Gradle Wrapper Scripts
- Android Activity Entry
- Login Form Logic
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

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 41 edges
2. `react` - 26 edges
3. `asyncHandler()` - 15 edges
4. `pool` - 15 edges
5. `ApiError` - 14 edges
6. `api` - 14 edges
7. `AdminDashboard()` - 13 edges
8. `validateMiddleware()` - 11 edges
9. `scripts` - 11 edges
10. `validators` - 11 edges

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

## Communities (58 total, 16 thin omitted)

### Community 0 - "Backend Dependencies"
Cohesion: 0.06
Nodes (36): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken (+28 more)

### Community 1 - "Frontend Mobile Framework"
Cohesion: 0.06
Nodes (35): @capacitor/android, @capacitor/cli, @capacitor/core, dependencies, @capacitor/android, @capacitor/core, react, react-dom (+27 more)

### Community 2 - "Product and Cart Management"
Cohesion: 0.12
Nodes (24): AdminProducts, Cart, Catalog, CartContext, CartProvider(), loadCart(), useCart(), AdminProducts() (+16 more)

### Community 3 - "Auth and Navigation Components"
Cohesion: 0.13
Nodes (16): plugins, App(), Home, Login, NotFound, Register, Footer(), Navbar() (+8 more)

### Community 4 - "Admin Zones and Notifications"
Cohesion: 0.12
Nodes (18): AdminZones, Notifications, AdminZones(), handleSubmit(), handleToggle(), load(), formatPrice(), Notifications() (+10 more)

### Community 5 - "Environment and Auth Logic"
Cohesion: 0.14
Nodes (21): assertValidEnv(), env, authenticate(), errorHandler(), notFoundHandler(), loginRules, registerRules, router (+13 more)

### Community 6 - "Admin Dashboard Operations"
Cohesion: 0.16
Nodes (23): AdminDashboard, AdminDashboard(), handleAssignDriver(), handleClearLogs(), handleCreateOrder(), handleCreateUser(), handleOrderStatus(), handleToggleUserActive() (+15 more)

### Community 7 - "Server Entry and Middleware"
Cohesion: 0.13
Nodes (16): apiLimiter, app, authLimiter, __dirname, uploadsPath, requireAdmin, requireAnyRole, requireClient (+8 more)

### Community 8 - "Backend Configuration and Testing"
Cohesion: 0.08
Nodes (23): description, devDependencies, nodemon, supertest, vitest, engines, node, name (+15 more)

### Community 9 - "Order Management Views"
Cohesion: 0.14
Nodes (19): AdminOrders, DriverOrders, AdminOrders(), handleAssign(), handleStatus(), load(), fmtMoney(), STATUS_FLOW (+11 more)

### Community 10 - "Project Scripts and Build"
Cohesion: 0.09
Nodes (22): concurrently, description, devDependencies, concurrently, name, private, scripts, build (+14 more)

### Community 11 - "Checkout and Address Management"
Cohesion: 0.18
Nodes (18): Checkout, MyAddresses, Checkout(), handleNewAddress(), formatPrice(), emptyForm, formatPrice(), MyAddresses() (+10 more)

### Community 12 - "Order Business Logic"
Cohesion: 0.20
Nodes (18): itemRules, orderRules, assertOrderStatus(), assignDriver(), changeOrderStatus(), createOrder(), getDriverIdByUserId(), getOrderById() (+10 more)

### Community 13 - "Promotion Management"
Cohesion: 0.16
Nodes (17): AdminPromotions, Promotions, AdminPromotions(), handleDelete(), handleSubmit(), handleToggleActive(), load(), empty (+9 more)

### Community 14 - "Container Inventory Management"
Cohesion: 0.19
Nodes (16): AdminContainers, Containers, AdminContainers(), handleAdjust(), handleRegister(), handleStatus(), load(), STATUS_LABELS (+8 more)

### Community 15 - "Password Recovery and Session"
Cohesion: 0.15
Nodes (14): ForgotPassword, ResetPassword, ForgotPassword(), handleSubmit(), ResetPassword(), handleSubmit(), clearSession(), forgotPassword() (+6 more)

### Community 16 - "Database Migrations and Seeds"
Cohesion: 0.16
Nodes (12): __dirname, ensureMigrationsTable(), getApplied(), MIGRATIONS_DIR, runMigrations(), __dirname, SEEDS_DIR, checkConnection() (+4 more)

### Community 17 - "Product Routes and Services"
Cohesion: 0.24
Nodes (10): __dirname, productRules, storage, upload, UPLOADS_DIR, createProduct(), getProductById(), listProducts() (+2 more)

### Community 18 - "Subscription Management"
Cohesion: 0.29
Nodes (10): MySubscriptions, FREQUENCIES, MySubscriptions(), handleChange(), handleCreate(), load(), STATUS_LABELS, createSubscription() (+2 more)

### Community 19 - "Validation and Error Handling"
Cohesion: 0.40
Nodes (4): ApiError, validate(), validateMiddleware(), validators

### Community 20 - "Container Logistics Routes"
Cohesion: 0.33
Nodes (8): router, createMovement(), getCustomerMovements(), getCustomerSummary(), listInventory(), registerContainers(), updateContainerStatus(), getCustomerIdByUserId()

### Community 21 - "Logging and Async Utilities"
Cohesion: 0.27
Nodes (5): router, router, asyncHandler(), logBuffer, logger

### Community 22 - "Subscription Routes and Services"
Cohesion: 0.33
Nodes (8): router, assertFrequency(), assertStatus(), createSubscription(), FREQUENCIES, listSubscriptions(), STATUSES, updateSubscription()

### Community 23 - "Address Routes and Services"
Cohesion: 0.42
Nodes (7): addressRules, router, createAddress(), deleteAddress(), getAddressById(), listCustomerAddresses(), updateAddress()

### Community 24 - "Promotion Routes and Services"
Cohesion: 0.36
Nodes (7): promotionRules, router, createPromotion(), deletePromotion(), getPromotionById(), listPromotions(), updatePromotion()

### Community 25 - "Android Unit Tests"
Cohesion: 0.36
Nodes (4): ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 26 - "Customer Order History"
Cohesion: 0.36
Nodes (7): MyOrders, formatPrice(), MyOrders(), handleRepeat(), load(), STATUS_LABELS, repeatOrder()

### Community 27 - "Social Media Icons"
Cohesion: 0.29
Nodes (7): Icon Library, Bluesky Icon, Discord Icon, Documentation Icon, GitHub Icon, Social Icon, X Icon

### Community 28 - "Linting Configuration"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 29 - "Order Detail View"
Cohesion: 0.47
Nodes (5): OrderDetail, formatPrice(), OrderDetail(), STATUS_LABELS, getOrder()

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

## Knowledge Gaps
- **142 isolated node(s):** `cors`, `express`, `helmet`, `pg`, `cors` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Auth and Navigation Components` to `Product and Cart Management`, `Admin Zones and Notifications`, `Login Form Logic`, `Admin Dashboard Operations`, `Order Management Views`, `Checkout and Address Management`, `Promotion Management`, `Container Inventory Management`, `Subscription Management`, `Customer Order History`, `Order Detail View`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `react` connect `Auth and Navigation Components` to `Product and Cart Management`, `Admin Zones and Notifications`, `Admin Dashboard Operations`, `Order Management Views`, `Checkout and Address Management`, `Promotion Management`, `Container Inventory Management`, `Password Recovery and Session`, `Subscription Management`, `Customer Order History`, `Order Detail View`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Backend Dependencies` to `Backend Configuration and Testing`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `cors`, `express`, `helmet` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._
- **Should `Frontend Mobile Framework` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Product and Cart Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._