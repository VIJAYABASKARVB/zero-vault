# Zero Vault — Complete Interview Preparation Guide

> **Project:** Zero Vault — Zero-knowledge password manager with client-side AES-256-GCM encryption
> **Developer:** Solo project (32 commits, ~6 days)
> **Status:** Live on Vercel (SPA + Serverless backend)
> **Stack:** React 19, Express 5, MongoDB, Clerk, Inngest, Web Crypto API, Tailwind CSS 4

---

## Table of Contents

- [1. Elevator Pitch](#1-elevator-pitch)
- [2. What Problem Does This Solve](#2-what-problem-does-this-solve)
- [3. Complete Architecture](#3-complete-architecture)
- [4. Repository Walkthrough](#4-repository-walkthrough)
- [5. File-by-File Analysis](#5-file-by-file-analysis)
- [6. Execution Flow](#6-execution-flow)
- [7. Request Lifecycle](#7-request-lifecycle)
- [8. Data Flow](#8-data-flow)
- [9. Component Deep Dive](#9-component-deep-dive)
- [10. Folder Dependency Graph](#10-folder-dependency-graph)
- [11. Design Patterns](#11-design-patterns)
- [12. Algorithms](#12-algorithms)
- [13. Data Structures](#13-data-structures)
- [14. Complexity Analysis](#14-complexity-analysis)
- [15. State Management](#15-state-management)
- [16. API Layer](#16-api-layer)
- [17. Database](#17-database)
- [18. Security](#18-security)
- [19. Performance](#19-performance)
- [20. Error Handling](#20-error-handling)
- [21. Configuration](#21-configuration)
- [22. Build System](#22-build-system)
- [23. Package Analysis](#23-package-analysis)
- [24. Environment Variables](#24-environment-variables)
- [25. CI/CD](#25-cicd)
- [26. Docker](#26-docker)
- [27. Testing](#27-testing)
- [28. Coding Practices](#28-coding-practices)
- [29. Feature-by-Feature Explanation](#29-feature-by-feature-explanation)
- [30. Possible Improvements](#30-possible-improvements)
- [31. Scalability](#31-scalability)
- [32. Interview Questions](#32-interview-questions)
- [33. Resume Questions](#33-resume-questions)
- [34. Defend the Project](#34-defend-the-project)
- [35. Hidden Details](#35-hidden-details)
- [36. Reverse Engineering](#36-reverse-engineering)
- [37. Code Ownership](#37-code-ownership)
- [38. Knowledge Graph](#38-knowledge-graph)
- [39. Cheat Sheet](#39-cheat-sheet)
- [40. Final Interview Handbook](#40-final-interview-handbook)

---

# 1. Elevator Pitch

## 30-Second (Recruiter)

Zero Vault is a password manager that encrypts your secrets in your browser before they ever reach a server. Even if the server is hacked, your passwords stay safe because the server never sees them in plain text. Built with React and Node.js, deployed live on Vercel.

## 1-Minute (Technical HR)

Zero Vault is a full-stack, zero-knowledge password manager. When you enter your master password, it is converted into an encryption key in your browser using PBKDF2. That key never leaves your browser. Your credentials are encrypted with AES-256-GCM before transmission, so the server stores only ciphertext it cannot decrypt. A verification token proves your master password is correct without ever transmitting it. Frontend: React 19 SPA with Clerk. Backend: Express 5 serverless. Database: MongoDB Atlas.

## 3-Minute (Senior Engineer)

Zero Vault addresses a fundamental trust problem in password management. The cryptographic protocol works in three phases:

1. Setup: Create master password, generate 16-byte salt, PBKDF2 derives 256-bit AES-GCM key (210,000 iterations, SHA-256), encrypt "VALID" as verification token, send only salt + ciphertext+IV to server.
2. Unlock: Re-enter master password, re-derive key from stored salt, decrypt verification token — if "VALID", key is correct and cached in React state.
3. CRUD: All credential fields encrypted with AES-256-GCM before reaching API. Decrypted on-demand only on Copy click.

Backend: Express 5 + Clerk JWT middleware. User lifecycle automated via Inngest + Clerk webhooks. MongoDB Atlas with embedded document pattern. Deployed as two separate Vercel projects.

## 5-Minute (Architect)

The zero-knowledge encryption boundary uses a verification token pattern: encrypt a known plaintext ("VALID") and store it as a challenge. AES-GCM provides authenticated encryption — a wrong key produces a decryption error, eliminating oracle attacks.

Trust boundary design: frontend handles all crypto (key derivation, encryption, decryption), backend handles auth (Clerk JWT) and persistence (MongoDB CRUD), Inngest handles async user lifecycle events. The encryption key exists only in React state — never in localStorage or cookies.

Data model uses embedded subdocuments: each user has one Vault document with an array of entry subdocuments. This eliminates joins entirely and provides O(1) per-user read. The 16MB document cap allows ~50,000 entries.

Deployment: separate Vercel projects for frontend (SPA) and backend (serverless). CORS configured with pragmatic whitelist. Main limitations: no rate limiting, no pagination, no TypeScript, no tests, key lost on page refresh.

---

# 2. What Problem Does This Solve

## The Existing Problem

Most password managers operate on a trust model: TLS protects data in transit, but once it reaches the server, the server has access to plaintext. If the server is compromised, an employee goes rogue, there is a backend vulnerability, or there is a subpoena — your secrets are exposed.

## Pain Points

| Pain Point | How Addressed |
|---|---|
| Server can read your passwords | AES-256-GCM encrypts everything client-side; server stores only ciphertext |
| Master password must be transmitted | PBKDF2 + verification token — password never leaves browser |
| Self-hosting is complex | Vercel free tier; no infrastructure management |
| User lifecycle is manual | Inngest + Clerk webhooks automate provision/deprovision |

## Target Users

Developers wanting inspectable password manager. Privacy-conscious individuals. Portfolio evaluators.

## Use Cases

1. Personal credential vault
2. Developer secrets manager
3. Future: team credential sharing

## Why This Matters

Demonstrates practical zero-knowledge architecture using browser-native Web Crypto API (AES-256-GCM + PBKDF2). Verification token pattern is a novel application of authenticated encryption. Entire system runs on Vercel free tier.

---

# 3. Complete Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph Browser
        REACT[React SPA]
        WEB_CRYPTO[Web Crypto API]
        STATE[Encryption Key in React State]
    end
    subgraph Vercel
        API[Express 5 API]
        CLERK_BE[Clerk JWT Middleware]
        INNGEST[Inngest Background Jobs]
    end
    subgraph MongoDB
        USERS[(Users)]
        VAULTS[(Vaults w/ Embedded Entries)]
    end
    subgraph Clerk
        CLERK_SRV[Clerk Auth + Webhooks]
    end
    REACT --> API
    WEB_CRYPTO --> STATE
    API --> USERS
    API --> VAULTS
    CLERK_BE --> CLERK_SRV
    CLERK_SRV --> INNGEST
    INNGEST --> USERS
```

## Layer Architecture

```mermaid
graph TB
    L1[Layer 1: Pages - HomePage, DashboardPage]
    L2[Layer 2: Components - 9 components]
    L3[Layer 3: Services - api.js HTTP client]
    L4[Layer 4: Crypto - crypto.js, passwordStrength.js]
    L5[Layer 5: Backend - Routes, Controllers, Auth Middleware]
    L6[Layer 6: Data - Mongoose Models, MongoDB Atlas]
    L7[Layer 7: Background - Inngest Functions]
    L1 --> L2
    L2 --> L3
    L2 --> L4
    L3 --> L5
    L5 --> L6
    L7 --> L6
```

## Request Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Clerk
    participant API
    participant Mongo
    actor Inngest

    Note over User,Inngest: Sign Up
    User->>Clerk: Click Sign Up
    Clerk->>Inngest: Webhook: clerk/user.created
    Inngest->>Mongo: User.create({clerkId, email})

    Note over User,Inngest: Setup Master Password
    User->>Browser: Enter master password
    Browser->>Browser: generateSalt() - deriveKey() - encrypt("VALID")
    Browser->>API: PUT /api/user/encryption {salt, token}
    API->>Mongo: Save salt + token
    API-->>Browser: {success: true}

    Note over User,Inngest: Unlock
    User->>Browser: Enter master password
    Browser->>API: GET /api/user/encryption
    API-->>Browser: {salt, token}
    Browser->>Browser: deriveKey() - decrypt() - check "VALID"

    Note over User,Inngest: Add Entry
    User->>Browser: Fill form, submit
    Browser->>Browser: encrypt(password, key)
    Browser->>API: POST /api/vault {ciphertext, iv, ...}
    API->>Mongo: Push to Entries array
    API-->>Browser: {entry}
    Browser->>Browser: Decrypt and display

    Note over User,Inngest: Copy Password
    User->>Browser: Click Copy
    Browser->>Browser: decrypt(_ciphertext, _iv, key)
    Browser->>Browser: clipboard.writeText(plaintext)
```

## File Dependency Graph

```mermaid
graph LR
    server_js[server.js] --> db_js[config/db.js]
    server_js --> inngest_js[config/inngest.js]
    server_js --> auth_mw[auth.middleware.js]
    server_js --> user_routes[user.routes.js]
    server_js --> vault_routes[vault.routes.js]
    user_routes --> user_ctrl[user.controller.js]
    vault_routes --> vault_ctrl[vault.controller.js]
    user_ctrl --> user_model[User.js]
    user_ctrl --> vault_model[Vault.js]
    vault_ctrl --> user_model
    vault_ctrl --> vault_model
    inngest_js --> db_js
    inngest_js --> user_model

    main_jsx[main.jsx] --> app_jsx[App.jsx]
    app_jsx --> home_page[HomePage.jsx]
    app_jsx --> dash_page[DashboardPage.jsx]
    dash_page --> navbar[Navbar.jsx]
    dash_page --> vault_header[VaultHeader.jsx]
    dash_page --> cat_tabs[CategoryTabs.jsx]
    dash_page --> entry_grid[EntryGrid.jsx]
    dash_page --> entry_modal[EntryModal.jsx]
    dash_page --> confirm_modal[ConfirmModal.jsx]
    dash_page --> mp_screen[MasterPasswordScreen.jsx]
    dash_page --> add_btn[AddEntryButton.jsx]
    dash_page --> api_service[api.js]
    dash_page --> crypto_util[crypto.js]
    entry_grid --> entry_card[EntryCard.jsx]
    entry_card --> crypto_util
    entry_card --> strength_util[passwordStrength.js]
    mp_screen --> crypto_util
    mp_screen --> api_service
```

---

# 4. Repository Walkthrough

## Root Level

| Entry | Type | Purpose |
|---|---|---|
| backend/ | Dir | Express 5 REST API server, deployed to Vercel as serverless functions |
| frontend/ | Dir | React 19 SPA, deployed to Vercel as static site |
| .gitignore | File | Ignores resume/doc files from version control |
| DESIGN.md | File | Design system specification (colors, typography, component specs) |
| PRODUCT.md | File | Product brief — brand personality, design principles |
| PROJECT_ANALYSIS.md | File | Self-contained technical analysis for interviews |
| README.md | File | Main documentation — features, setup, API, deployment |
| RESUME_AGENT.md | File | Prompt template for AI resume generation |
| RESUME_OUTPUT.md | File | Generated resume bullets and talking points |
| ZERO_VAULT_METRICS.md | File | Codebase metrics — endpoints, schemas, counts |

## backend/ Structure

```
backend/
  .env                    # Environment variables (secrets) - gitignored
  .gitignore              # Ignores node_modules, .env
  package.json            # Dependencies: express, mongoose, clerk, inngest, argon2
  package-lock.json       # Locked dependency tree
  server.js               # Entry point — Express app setup, middleware, routes
  vercel.json             # Vercel serverless config
  scripts/                # Empty directory (placeholder for seed scripts)
  src/
    config/
      db.js               # MongoDB connection via Mongoose
      inngest.js          # Inngest client + background job definitions
    controllers/
      user.controller.js  # GET/PUT /api/user/encryption handlers
      vault.controller.js # CRUD for vault entries
    middleware/
      auth.middleware.js   # Clerk JWT verification gate
    models/
      User.js             # User schema (clerkId, email, crypto fields)
      Vault.js            # Vault schema (entries as embedded subdocs)
    routes/
      user.routes.js      # /api/user/encryption routes
      vault.routes.js     # /api/vault CRUD routes
```

**Why this structure?** MVC-lite pattern: Controllers handle business logic, Models define schemas, Routes define endpoints, Config holds initialization code, Middleware holds cross-cutting concerns.

**Why empty scripts/?** Intended for database seed scripts that were never implemented.

## frontend/ Structure

```
frontend/
  .env                    # Frontend env vars (Clerk key, API URL) - gitignored
  .gitignore              # Ignores node_modules, dist, .env
  index.html              # HTML entry point (fonts, app mount)
  package.json            # Dependencies: react, clerk, tailwind, vite
  vite.config.js          # Vite config (React + Tailwind plugins)
  vercel.json             # SPA rewrite rule
  eslint.config.js        # ESLint flat config
  public/
    favicon.svg           # Browser tab icon
    icons.svg             # SVG icon sprite
    logo.png              # Logo for meta tags
  dist/                   # Build output (gitignored)
  src/
    main.jsx              # App entry — ClerkProvider, BrowserRouter, StrictMode
    App.jsx               # Root component — route definitions, auth guards
    index.css             # Tailwind import + custom theme variables
    assets/
      hero.png            # Landing page hero image
      logo.png            # App logo
    components/
      Navbar.jsx          # Top nav: logo, search, user button
      VaultHeader.jsx     # "All Vaults" header with entry count
      CategoryTabs.jsx    # All/Work/Personal/Finance/Developer tabs
      EntryGrid.jsx       # Responsive card grid container
      EntryCard.jsx       # Individual vault entry card
      EntryModal.jsx      # Add/Edit entry form modal
      ConfirmModal.jsx    # Delete confirmation modal
      MasterPasswordScreen.jsx  # Setup/Unlock master password screen
      AddEntryButton.jsx  # FAB for adding entries
    pages/
      HomePage.jsx        # Landing page with hero + auth buttons
      DashboardPage.jsx   # Main vault dashboard (orchestrator)
    services/
      api.js              # REST API client (all 6 endpoints)
    utils/
      crypto.js           # Web Crypto API wrapper (6 functions)
      passwordStrength.js # Password scoring algorithm
    data/
      dummyEntries.js     # 8 mock entries for development UI testing
```

**Why components vs pages?** Pages are route-level components (full screens). Components are reusable UI pieces.

**Why services/ for API?** Separates HTTP logic from components for testability.

**Why utils/ for crypto?** Pure functions with no React dependencies — testable and independent.

**Why data/dummyEntries.js?** Used during development to populate vault grid without needing a backend.

---

# 5. File-by-File Analysis

## 5.1 backend/server.js — Application Entry Point

**Purpose:** Express server initialization, middleware stack, route registration.

**Middleware Stack (order matters):**

| Order | Middleware | Purpose |
|---|---|---|
| 1 | express.json() | Parse JSON request bodies |
| 2 | cors() | Cross-origin requests from SPA |
| 3 | clerkMiddleware() | Attach Clerk auth info to every request |
| 4 | /api/inngest | Inngest webhook handler |
| 5 | connectDB() | MongoDB connection (async, non-blocking) |
| 6 | requireAuth | Applied to /api/user and /api/vault |

**CORS Logic:**
- No origin → allow (server-to-server)
- .vercel.app → allow (Vercel deployments)
- localhost:5173 → allow (dev)
- FRONTEND_URL env → allow (explicit prod URL)
- Everything else → deny

**Interview Question:** Why check origin.endsWith('.vercel.app')? Allows Vercel preview deployments automatically. Security concern: any .vercel.app subdomain can make CORS requests — but still need valid Clerk JWT.

**Startup Sequence:** dotenv.config() → Express app created → Middleware stacked → connectDB() called (non-blocking) → app.listen(3000)

**Tradeoff:** Server starts listening before MongoDB connects. In serverless, each cold start reconnects.

## 5.2 backend/src/config/db.js — MongoDB Connection

**Purpose:** Initialize MongoDB via Mongoose.

**Weaknesses:** No retry logic, no connection options, no crash on failure. Server starts in degraded state if DB fails.

## 5.3 backend/src/config/inngest.js — Background Jobs

**Purpose:** Two Inngest functions for user lifecycle:

- syncUser: Triggered by clerk/user.created → creates User document with clerkId + email
- deleteUser: Triggered by clerk/user.deleted → removes User by clerkId

**Interesting Details:**
- connectDB() called inside each function (serverless cold starts)
- No error handling — Inngest retries on failure
- clerkClient is imported but never used (dead code)
- Vault document NOT created here — created lazily in setupEncryption

**Potential Bug:** If syncUser runs again (webhook retry), User.create() throws duplicate key error. Should use findOneAndUpdate with upsert.

## 5.4 backend/src/middleware/auth.middleware.js — Auth Guard

**Purpose:** Extract Clerk user ID from JWT, attach to request.

```javascript
const {userId} = getAuth(req);
if (!userId) return res.status(401).json({error: "Unauthorized"});
req.auth.userId = userId;
next();
```

**Key Insight:** req.auth.userId is Clerk ID, not MongoDB _id. Every controller must look up MongoDB user by clerkId first.

## 5.5 backend/src/models/User.js — User Schema

**Fields:** clerkId (unique), email (unique), masterPasswordHash (unused), salt (unused), encryptionSalt, verificationToken, timestamps.

**Dead Fields:** masterPasswordHash and salt are defined but never populated. Schema-ready for future Argon2 server-side verification.

## 5.6 backend/src/models/Vault.js — Vault Schema

**Design:** Embedded subdocuments. Each user has one Vault document with Entries array.

**VaultEntry fields:** label, username, password (ciphertext), url, category (enum), notes, iv, timestamps.

**Key Choice:** Embedded over referenced. Single query per user read. No joins needed. 16MB cap allows ~32,000 entries at 500 bytes each.

## 5.7 backend/src/controllers/user.controller.js

- getEncryptionConfig: Find user by clerkId, return salt + token (or null)
- setupEncryption: Save salt + token, create Vault document if missing (lazy init)

## 5.8 backend/src/controllers/vault.controller.js

- getVault: Find user by clerkId, find vault by userId, return Entries array
- addEntry: Find or create vault, push entry, return created entry
- updateEntry: Find entry by _id in Entries array, update fields conditionally, save
- deleteEntry: Find entry, vault.Entries.pull({_id}), save

**Repeated Pattern:** Every controller repeats User.findOne({clerkId}) — DRY violation.

**Bug Risk:** No null check on user.findOne result before accessing user._id.

## 5.9 frontend/src/main.jsx — React Entry

**Purpose:** Bootstrap with all global providers: StrictMode → BrowserRouter → ClerkProvider → App

**Startup validation:** Throws if VITE_CLERK_PUBLISHABLE_KEY missing.

## 5.10 frontend/src/App.jsx — Root Component

Two routes with auth guards:
- / → HomePage (if signed out) or redirect to /dashboard
- /dashboard → DashboardPage (if signed in) or redirect to /

## 5.11 frontend/src/services/api.js — API Client

6 exported functions wrapping generic request() helper. Token passed explicitly (not stored globally).

## 5.12 frontend/src/utils/crypto.js — Web Crypto Wrapper

6 functions (4 exported, 2 internal):
- deriveKey: PBKDF2 + SHA-256, 210,000 iterations, non-extractable key
- generateSalt: CSPRNG 16-byte hex string
- encrypt: AES-256-GCM, random 12-byte IV, returns {ciphertext, iv} base64
- decrypt: AES-256-GCM, returns plaintext string
- arrayBufferToBase64 / base64ToArrayBuffer: internal helpers

## 5.13 frontend/src/utils/passwordStrength.js

Point-based scoring (0-100). Checks length, uppercase, lowercase, digits, special chars. Returns {score, label, color, width}.

**Weakness:** Does not detect common passwords or patterns. "password123!" scores 70 (Strong).

## 5.14 frontend/src/data/dummyEntries.js

8 mock entries for UI development. Plaintext passwords (never sent to API).

## 5.15 frontend/src/index.css

Tailwind CSS 4 import + custom theme: Geist font, JetBrains Mono utility, brand background color.

## 5.16 frontend/src/pages/HomePage.jsx

Landing page for signed-out users. Header with Clerk auth buttons, hero section with two-column grid.

## 5.17 frontend/src/pages/DashboardPage.jsx

Main orchestrator. 12 state variables, 2 useEffect hooks, 1 useMemo. Manages app mode (loading/setup/unlock/ready), CRUD operations, and modal state.

## 5.18-5.26 Components

See Section 9 for detailed component analysis.

## 5.27-5.31 Config Files

See Section 21 for configuration analysis.

---

# 6. Execution Flow

## Backend Startup

1. dotenv.config() — Loads .env into process.env
2. express() — Creates app
3. express.json() — JSON body parser middleware
4. cors() — CORS middleware with origin validation
5. clerkMiddleware() — Clerk JWT verification
6. /api/inngest — Inngest webhook handler (GET + POST)
7. connectDB() — Mongoose.connect() (non-blocking, not awaited)
8. /api/user with requireAuth — Mount user routes
9. /api/vault with requireAuth — Mount vault routes
10. app.listen(3000) — HTTP server starts accepting requests

## Frontend Startup

1. index.html loads fonts (Geist from cdnfonts.com, JetBrains Mono from Google Fonts)
2. main.jsx: ClerkProvider validates publishable key, renders App
3. App.jsx: useUser() checks Clerk session → redirects based on auth state
4. DashboardPage: fetches encryption config → determines mode (setup/unlock/ready)

## Full User Journey

### New User:
Landing → Register (Clerk) → Webhook → Inngest creates User → Dashboard loading → no salt → Setup mode → Enter password, confirm → generateSalt → deriveKey → encrypt("VALID") → PUT /api/user/encryption → creates Vault → Ready mode → Empty dashboard → Click FAB → Fill form → encrypt(password) → POST /api/vault → Decrypt locally → Display in grid

### Returning User:
Landing → Clerk session exists → Auto-redirect to /dashboard → loading → salt found → Unlock mode → Enter password → deriveKey → decrypt token → "VALID" → Ready mode → Fetch entries → Decrypt all locally → Display in grid → Click Copy on entry → decrypt(password) on demand → clipboard

---

# 7. Request Lifecycle

## Complete Trace: Add Vault Entry

### Step 1: User fills form
User clicks FAB → setShowModal(true) → Modal renders → User fills form → Clicks "Save Entry" → handleSubmit()

### Step 2: Frontend Validation
EntryModal validates: label required, username required, password required. If errors, displays red borders + error messages.

### Step 3: Encryption (Browser)
```javascript
const {ciphertext, iv} = await encrypt(formData.password, encryptionKey)
// 1. crypto.getRandomValues(new Uint8Array(12)) → random IV
// 2. TextEncoder.encode(password)
// 3. crypto.subtle.encrypt({name: "AES-GCM", iv}, key, encoded)
// 4. arrayBufferToBase64(ciphertext), arrayBufferToBase64(iv.buffer)
```

### Step 4: API Call
```javascript
const {entry} = await createEntry(token, {
    ...formData,
    password: ciphertext,  // ciphertext, not plaintext
    iv
})
```

### Step 5: Backend Middleware
express.json() → cors() → clerkMiddleware() → requireAuth (extracts Clerk userId)

### Step 6: Vault Controller
Find user by clerkId → Find or create vault → Push entry to Entries array → save() → Return created entry with _id

### Step 7: Database Operation
MongoDB: updateOne with $push to Entries array

### Step 8: Response
JSON with entry object (password = ciphertext, iv)

### Step 9: Frontend State Update
```javascript
const decryptedEntry = {
    ...entry,
    password: await decrypt(entry.password, entry.iv, encryptionKey),
    _ciphertext: entry.password,  // Save for on-demand decryption
    _iv: entry.iv
}
setEntries(prev => [...prev, decryptedEntry])
```

### Step 10: Render
DashboardPage re-renders → useMemo recomputes filtered entries → EntryGrid renders new card

---

# 8. Data Flow

## Data Origin Points

| Data | Origin | Format | Storage |
|---|---|---|---|
| Master password | User input | String | Never stored |
| Encryption key | PBKDF2 derivation | CryptoKey (non-extractable) | React state only |
| Encryption salt | crypto.getRandomValues() | 32-char hex | MongoDB User |
| Verification token | encrypt("VALID", key) | "ciphertext:iv" | MongoDB User |
| Entry password | User input | Plaintext (transient) | Never stored as plaintext |
| Entry ciphertext | encrypt(password, key) | base64 string | MongoDB Vault entry |
| IV per entry | crypto.getRandomValues() | base64 string | MongoDB Vault entry |
| Entry plain fields | User input | String | MongoDB as-is |

## Encryption Pipeline (Add Entry):
User Input → TextEncoder → crypto.subtle.encrypt → arrayBufferToBase64 → JSON.stringify → HTTP POST → MongoDB $push

## Decryption Pipeline (Load Dashboard):
HTTP GET → JSON parse → For each entry: base64ToArrayBuffer → crypto.subtle.decrypt → TextDecoder → React state

## On-Demand Decryption (Copy Password):
Click Copy → decrypt(_ciphertext, _iv, encryptionKey) → clipboard.writeText(plaintext)

## Data Not Validated
- Ciphertext format (not validated server-side)
- URL format
- Payload size limits
- Verification token format

---

# 9. Component Deep Dive

## 9.1 App (App.jsx)
- Purpose: Root component with auth-guarded routes
- Hooks: useUser() from Clerk
- Optimization: null return while loading prevents flicker
- States: 2 routes, 4 states (loading/signed out/signed in)

## 9.2 DashboardPage (DashboardPage.jsx)
- Purpose: Main vault orchestrator
- State: 12 pieces (appMode, entries, searchQuery, activeTab, modals, etc.)
- Hooks: useState x9, useEffect x2, useMemo x1, useAuth
- App modes: loading → setup/unlock → ready
- CRUD handlers: onAdd, onUpdate, confirmDelete
- Optimization: useMemo for filtered entries, conditional rendering for modals

## 9.3 Navbar (Navbar.jsx)
- Props: searchQuery, onSearchChange
- Hooks: useRef (for input focus)
- Layout: Three-column grid (Logo | Search | UserButton)
- Note: No debounce on search — fine for <100 entries

## 9.4 VaultHeader (VaultHeader.jsx)
- Props: totalCount
- Note: Filter/Sort buttons are non-functional placeholders

## 9.5 CategoryTabs (CategoryTabs.jsx)
- Categories: All, Work, Personal, Finance, Developer
- Props: activeTab, onTabChange
- Accessibility: aria-current="page" on active tab

## 9.6 EntryGrid (EntryGrid.jsx)
- Props: entries, onEdit, onDelete, searchQuery, encryptionKey
- Responsive grid: 1/2/3/4 columns
- Empty state: "No results found" message

## 9.7 EntryCard (EntryCard.jsx)
- Props: entry, onEdit, onDelete, encryptionKey
- On-demand decryption: Password decrypted only on Copy click
- Security: entry.password decrypted for strength bar (plaintext in memory)
- Optimization needed: React.memo would prevent unnecessary re-renders

## 9.8 EntryModal (EntryModal.jsx)
- Props: isOpen, onClose, onSubmit, mode, entry
- State: form, errors
- Validation: label, username, password required
- Pattern: Controlled form, useEffect for pre-population, backdrop click to close

## 9.9 ConfirmModal (ConfirmModal.jsx)
- Props: isOpen, onClose, onConfirm, label
- Simple confirmation dialog with Cancel/Delete buttons

## 9.10 MasterPasswordScreen (MasterPasswordScreen.jsx)
- Props: mode (setup|unlock), encryptionConfig, onUnlock, onSetup
- State: password, confirmPassword, error, loading
- Setup: generateSalt → deriveKey → encrypt("VALID") → save token → onSetup(key)
- Unlock: deriveKey → decrypt token → check "VALID" → onUnlock(key)
- Error masking: Any exception becomes "Wrong password" (good UX, hides bugs)

## 9.11 AddEntryButton (AddEntryButton.jsx)
- Props: onClick
- Animation: hover:scale-110 with shadow transition
- Fixed position: bottom-8 right-8

---

# 10. Folder Dependency Graph

## Backend Dependencies

server.js → config/db.js, config/inngest.js, middleware/auth.middleware.js, routes/user.routes.js, routes/vault.routes.js
user.controller.js → models/User.js, models/Vault.js
vault.controller.js → models/User.js, models/Vault.js
inngest.js → config/db.js, models/User.js

**Tight Coupling:** Controllers directly import Models (no service layer).
**Circular Dependencies:** None.

## Frontend Dependencies

main.jsx → App.jsx
App.jsx → pages/HomePage.jsx, pages/DashboardPage.jsx
DashboardPage.jsx → 7 components, services/api.js, utils/crypto.js
EntryCard.jsx → utils/crypto.js, utils/passwordStrength.js
MasterPasswordScreen.jsx → utils/crypto.js, services/api.js

**Prop Drilling Chain:** DashboardPage → EntryGrid → EntryCard (2 levels — acceptable).
**Circular Dependencies:** None.

## Shared Dependencies

crypto.js: Used by DashboardPage, EntryCard, MasterPasswordScreen — no React dependencies
api.js: Used by DashboardPage, MasterPasswordScreen — no React dependencies

---

# 11. Design Patterns

## 11.1 Provider Pattern
**Where:** main.jsx — ClerkProvider wraps entire app. Provides auth context without prop drilling.

## 11.2 Lifting State Up
**Where:** DashboardPage.jsx — All mutable state lives in the common ancestor. Children receive state as props and notify via callbacks.

## 11.3 Higher-Order Function (API Client)
**Where:** services/api.js — Generic request() function wraps fetch with error handling. 6 endpoint-specific functions call it with different parameters.

## 11.4 Facade Pattern (Crypto Module)
**Where:** utils/crypto.js — Web Crypto API is verbose. The module wraps it into 4 simple functions.

## 11.5 MVC-Lite (Backend)
Models (data) → Controllers (business logic) → Routes (HTTP). No formal View layer — JSON responses.

## 11.6 Module Pattern (ESM)
Each file exports specific functions. Internal functions remain private (e.g., arrayBufferToBase64 in crypto.js).

## 11.7 Callback Pattern
Child-to-parent communication via callbacks (onTabChange, onSearchChange, onSubmit).

## 11.8 Conditional Rendering
Ternary, guard clause (if !isOpen return null), switch-like (appMode checks), early return (useEffect guards).

## 11.9 Lazy Initialization
Vault document created only when needed (on encryption setup or first entry add), not on signup.

## 11.10 On-Demand Decryption
Password decrypted only when Copy is clicked. Minimizes plaintext exposure in memory.

---

# 12. Algorithms

## 12.1 PBKDF2 Key Derivation
- Algorithm: PBKDF2-HMAC-SHA-256
- Iterations: 210,000
- Output: 256-bit AES-GCM key (non-extractable)
- Time: O(210,000 x SHA-256) — ~100-500ms on modern hardware
- OWASP 2023 recommends 600,000 iterations

## 12.2 AES-256-GCM Encryption
- Authenticated encryption (confidentiality + integrity)
- Random 12-byte IV per encryption
- Non-extractable key (cannot be exported)

## 12.3 Password Strength Scoring
- Point-based: length, uppercase, lowercase, digits, special chars
- 0-33 Weak, 34-66 Medium, 67-100 Strong
- O(n) time, O(1) space
- Does not detect common passwords or patterns

## 12.4 Filtered Search
- Category filter + text search (label, username)
- O(n) time, O(n) space per render
- useMemo prevents recomputation on unrelated state changes

## 12.5 Base64 Encoding/Decoding
- Manual conversion using btoa/atob + Uint8Array
- O(n) time, O(n) space

---

# 13. Data Structures

## Arrays
- entries state in DashboardPage
- Entries subdocument array in Vault
- Used for: filter(), find(), map(), immutable updates with spread

## Objects (Maps)
- CATEGORY_COLORS lookup table in EntryCard
- Static keys, fixed size — object literal is simplest

## Mongoose Embedded Documents
- Vault.Entries is an array of subdocuments
- Single query per user read, no joins
- 16MB cap allows ~32,000 entries

## Base64 Strings
- Ciphertext and IV stored as base64
- More compact than hex (6 bits/char vs 4 bits/char)

---

# 14. Complexity Analysis

## Feature Complexity

| Feature | Time Complexity | Space Complexity | Notes |
|---|---|---|---|
| PBKDF2 Key Derivation | O(210k x hash) CPU | O(1) | ~100-500ms |
| AES-256-GCM Encrypt | O(n) | O(n) | Hardware-accelerated |
| AES-256-GCM Decrypt | O(n) | O(n) | Hardware-accelerated |
| Password Strength | O(n) | O(1) | Single regex pass |
| Filter + Search | O(n) | O(n) | Two passes |
| Salt Generation | O(1) | O(1) | 16 random bytes |
| Vault CRUD (server) | O(1) query + O(n) array scan | O(n) | Mongoose subdoc find |

## Worst-Case Scenarios
- 10,000 entries with search: 20,000 string comparisons
- PBKDF2 on mobile: 1-2 seconds
- Large entry update: Load entire Vault, O(n) scan, save entire doc
- Concurrent updates: Last write wins (no optimistic locking)

---

# 15. State Management

## State Inventory

| State | Type | Owner | Scope | Persistence |
|---|---|---|---|---|
| encryptionKey | CryptoKey | DashboardPage | DashboardPage + EntryCard | None (lost on refresh) |
| entries | array | DashboardPage | DashboardPage + EntryGrid + EntryCard | None (re-fetched) |
| searchQuery | string | DashboardPage | DashboardPage + Navbar | None |
| activeTab | string | DashboardPage | DashboardPage + CategoryTabs | None |
| appMode | string | DashboardPage | DashboardPage only | None |
| modal states | boolean/obj | DashboardPage | DashboardPage + modals | None |
| form state | object | EntryModal | EntryModal only | None |
| password/error | string | MasterPasswordScreen | MasterPasswordScreen only | None |

## Why No Global State Management?
- Single page of complexity (only dashboard needs complex state)
- No cross-page state needs (except Clerk auth, already in Context)
- Small state surface (12 closely related variables)

## Key State: EncryptionKey
- Created: During setup (deriveKey) or unlock (re-deriveKey)
- Stored: React state in DashboardPage
- Used: Passed to EntryCard for on-demand decryption
- Destroyed: On page refresh (deliberate — security over convenience)
- Never persisted: Not in localStorage, sessionStorage, cookies, URL params

---

# 16. API Layer

## Endpoint Reference

**User Encryption:**
- GET /api/user/encryption — Fetch salt + verification token (for unlock)
- PUT /api/user/encryption — Save salt + token (after setup)

**Vault CRUD:**
- GET /api/vault — Get all entries for authenticated user
- POST /api/vault — Create new entry
- PUT /api/vault/:entryId — Update specific entry
- DELETE /api/vault/:entryId — Delete specific entry

**Error Responses:**
- 400: Missing required fields
- 401: Missing/invalid JWT
- 404: User/Vault/Entry not found

## API Design
- RESTful: Resource-based URLs, HTTP methods for CRUD, JSON bodies, status codes
- Missing: Pagination, sorting, batch operations, API versioning, global error handler

---

# 17. Database

## Schema Design

**User Collection:**
{clerkId (unique), email (unique), masterPasswordHash (unused), salt (unused), encryptionSalt, verificationToken, timestamps}

**Vault Collection:**
{userId (ref: User, unique), Entries: [{label, username, password (ciphertext), url, category (enum), notes, iv, timestamps}], timestamps}

## Indexes
- users.clerkId: unique
- users.email: unique
- vaults.userId: unique

## Query Patterns
- Find user by clerkId: Every API call
- Find vault by userId: Every vault operation
- Push/pull entry: Add/delete operations
- Array find by _id: Update operations (O(n) scan)

## Embedded vs. Referenced
**Chosen:** Embedded subdocuments. Correct for personal password manager (all entries always read together, no cross-user queries, eliminates N+1 problem). Would need separate collection for team sharing or per-entry access control.

---

# 18. Security

## Threat Model

**Server Compromise:** Attacker accesses ciphertext, salts, tokens. CANNOT read plaintext — encryption key never stored server-side. Risk: Low (architecturally mitigated).

**Brute-Force Master Password:** PBKDF2 210,000 iterations = ~100ms per guess = 10 passwords/second. 100,000 common passwords = ~3 hours. Mitigation: Increase to 600,000 (OWASP 2023).

**XSS:** Attacker could call decrypt() to get plaintext — key is in JavaScript closure. Mitigation: React escaping (no dangerouslySetInnerHTML). Risk: Medium.

**CSRF:** Not applicable — Bearer token in Authorization header, not cookies.

## Verification Token Pattern
Most architecturally interesting security feature:
- Setup: encrypt("VALID", key) → store ciphertext:iv as token
- Unlock: decrypt(token, key) → if "VALID", password is correct
- AES-GCM authenticated encryption: wrong key produces decryption error (not garbage)

## Security Weaknesses
| Issue | Severity | Fix |
|---|---|---|
| No rate limiting | Medium | express-rate-limit |
| PBKDF2 210k vs 600k | Low | Increase iterations |
| No input sanitization | Low | Validate/cap input sizes |
| No request size limits | Low | express.json({ limit: "1mb" }) |
| No helmet/security headers | Low | helmet middleware |
| Dead fields (masterPasswordHash) | Low | Remove or secure |
| Error messages leak user existence | Low | Generalize error messages |

---

# 19. Performance

## Bundle Size
~90KB gzipped (React, React Router, Clerk, react-icons, Tailwind extracted classes). Well under 200KB recommendation.

## Expensive Operations
- PBKDF2: 100-500ms (browser)
- AES encrypt/decrypt: <1ms (hardware-accelerated)
- Initial entry load: ~200ms for 100 entries
- Filtered search: <1ms for 100 entries

## Re-render Causes
- Typing in search: Full dashboard + all cards re-render
- Adding entry: Full grid re-render
- Switching category: Full grid re-render

## Optimization Opportunities
- React.memo on EntryCard (prevents N-1 unnecessary re-renders)
- Search debounce (150ms)
- Virtual scrolling for 1000+ entries
- font-display: swap for font loading

---

# 20. Error Handling

## Error Handling Inventory

| Location | Error | Handling |
|---|---|---|
| api.js | Network error | Parse error body → throw Error |
| api.js | JSON parse error | .catch(() => ({})) fallback |
| MasterPasswordScreen | Wrong password | Catch → "Wrong password" message |
| MasterPasswordScreen | Crypto error | Catch → err.message |
| vault.controller | Entry not found | 404 response |
| user.controller | Missing fields | 400 response |
| auth.middleware | No userId | 401 response |
| db.js | Connection failed | console.error (no crash) |

## What Is Missing
- Global error handler middleware (Express default returns HTML)
- process.on("uncaughtException") handler
- EntryModal loading state (prevents double-submit)
- Network retry or offline detection
- useEffect cleanup functions

---

# 21. Configuration

| File | Purpose | If Removed |
|---|---|---|
| frontend/vite.config.js | Vite build config (React + Tailwind plugins) | App won't build |
| frontend/.env | Frontend env vars | Auth fails, API calls fail |
| frontend/eslint.config.js | ESLint rules | Lint won't check code quality |
| frontend/vercel.json | SPA rewrite rules | Direct URL to /dashboard returns 404 |
| frontend/index.html | HTML entry point | Nothing serves the app |
| backend/.env | Backend secrets | Server starts but operations fail |
| backend/vercel.json | Serverless deployment config | Vercel deployment fails |

---

# 22. Build System

**Bundler:** Vite 8
**Compiler:** @vitejs/plugin-react (JSX transform, Fast Refresh)
**CSS:** @tailwindcss/vite plugin (Tailwind CSS 4)
**Output:** Static SPA (frontend/dist/)

Vite handles:
- Hot Module Replacement (HMR) during development
- Code splitting (automatic based on dynamic imports — none used currently)
- Tree shaking (removes unused exports)
- CSS extraction (purges unused Tailwind classes)

---

# 23. Package Analysis

## Frontend Dependencies

| Package | Purpose | Why This One | Alternative |
|---|---|---|---|
| react 19 | UI framework | Latest stable | Vue, Svelte |
| react-dom 19 | DOM rendering | Required by React | Preact (lighter) |
| react-router-dom 7 | Client-side routing | Standard for React SPAs | TanStack Router |
| @clerk/clerk-react 5 | Authentication | Pre-built UI + JWT management | Auth0, Firebase Auth |
| @tailwindcss/vite 4 | CSS framework | Utility-first, no runtime | CSS Modules, styled-components |
| react-icons 5 | Icon library | Feather-style icons | Heroicons, lucide-react |
| tailwindcss 4 | CSS framework | Required by plugin | N/A |

## Backend Dependencies

| Package | Purpose | Why This One | Alternative |
|---|---|---|---|
| express 5 | HTTP framework | Standard Node.js API framework | Fastify, Hono |
| mongoose 9 | MongoDB ODM | Schema validation + query building | Prisma, Typegoose |
| @clerk/express 2 | Clerk server-side auth | JWT verification middleware | Auth0 SDK, custom JWT |
| inngest 4 | Background jobs | Direct Clerk webhook integration | BullMQ, Celery |
| argon2 0.44 | Password hashing | Schema-ready, unused | bcrypt |
| cors 2.8 | CORS middleware | Standard | Custom middleware |
| dotenv 17 | Env variable loading | Standard | --env-file flag |
| nodemon 3 (dev) | Auto-restart | Dev convenience | tsx, watching |

## Unused Dependencies
- argon2: Installed but never called. Schemas have masterPasswordHash/salt fields but nothing populates them.

---

# 24. Environment Variables

## Backend

| Variable | Where Used | Purpose | Security |
|---|---|---|---|
| MONGO_URI_URL | config/db.js | MongoDB connection string | Contains credentials — keep secret |
| CLERK_SECRET_KEY | @clerk/express | Clerk API secret | Keep secret |
| CLERK_PUBLISHABLE_KEY | @clerk/express | Clerk public identifier | Safe to expose |
| INNGEST_EVENT_KEY | config/inngest.js | Inngest event publishing | Keep secret |
| INNGEST_SIGNING_KEY | config/inngest.js | Webhook signature verification | Keep secret |
| FRONTEND_URL | server.js (CORS) | Explicit CORS origin | Safe to expose |

## Frontend

| Variable | Where Used | Purpose | Security |
|---|---|---|---|
| VITE_CLERK_PUBLISHABLE_KEY | main.jsx | Clerk SDK initialization | Safe to expose (public) |
| VITE_API_URL | services/api.js | Backend API base URL | Safe to expose |

## Startup Validation
- Frontend: throws if VITE_CLERK_PUBLISHABLE_KEY is missing
- Backend: no validation — missing vars cause runtime errors

---

# 25. CI/CD

**No CI/CD pipeline configured.** The project relies on:
- Vercel auto-deploy (when connected to GitHub repo)
- Manual deployment via `vercel --prod`

**Missing:** GitHub Actions for linting, testing, build verification.

---

# 26. Docker

**No Docker configuration.** The project runs on Vercel serverless, which handles containerization automatically. Docker would be needed for self-hosted deployment.

---

# 27. Testing

**No test configuration.** package.json has placeholder: `"test": "echo \"Error: no test specified\" && exit 1"`.

**What should be tested:**
- Unit tests: crypto.js (encrypt/decrypt roundtrip, deriveKey determinism), passwordStrength.js
- Integration tests: API endpoints (vault CRUD, encryption config)
- Component tests: DashboardPage, EntryCard, MasterPasswordScreen
- E2E tests: Full user flow (signup → setup → add entry → unlock → copy)

**Testing tools not configured:** Jest, Vitest, Playwright, React Testing Library.

---

# 28. Coding Practices

## Strengths
- Clean separation of concerns (MVC-lite backend)
- Pure utility functions (crypto.js has no React dependencies)
- Consistent naming (camelCase, PascalCase for components)
- Descriptive variable names (encryptionConfig, verificationToken)
- Security-conscious patterns (on-demand decryption, non-extractable keys)

## Weaknesses
- Repeated User.findOne({clerkId}) in every controller (DRY violation)
- No null checks on user.findOne results (crash risk)
- Dead code: clerkClient import in inngest.js, argon2 dependency
- No TypeScript (type errors caught at runtime, not compile time)
- No service layer between controllers and models
- Inconsistent error handling (global handler missing)
- Large component (DashboardPage: 180 lines, 12 state variables)
- No cleanup functions in useEffect

## SOLID Analysis
- Single Responsibility: Mostly followed. Each controller handles one resource.
- Open/Closed: Routes are open for extension (add new routes) but controllers are closed for modification.
- Liskov Substitution: Not really applicable (no inheritance hierarchy).
- Interface Segregation: API exports are specific functions, not a monolithic object.
- Dependency Inversion: Controllers depend directly on Models (concrete), not abstractions. Could use repository pattern.

---

# 29. Feature-by-Feature Explanation

## 29.1 Client-Side AES-256-GCM Encryption

**Business goal:** Ensure server cannot read stored passwords

**Architecture:** Web Crypto API in browser encrypts plaintext before transmission. Server never receives encryption key.

**Files involved:** crypto.js (deriveKey, encrypt, decrypt), api.js (createEntry, updateEntry), DashboardPage.jsx (onAdd, onUpdate), EntryCard.jsx (Copy button)

**Flow:** User input → encrypt() → API call → MongoDB stores ciphertext

**Interview questions:**
- Why AES-256-GCM over AES-256-CBC? GCM provides authenticated encryption (integrity check). CBC requires separate HMAC for authentication.
- Why client-side encryption? Eliminates server as trust boundary. Server stores data it cannot read.
- What if the user forgets their master password? Data is permanently unrecoverable — no password reset possible. This is inherent to zero-knowledge systems.

## 29.2 PBKDF2 Key Derivation with Zero-Knowledge Unlock

**Business goal:** Verify master password without transmitting it or the derived key

**Architecture:** encrypt("VALID") as verification token. Re-derive key on unlock, decrypt token, check plaintext.

**Files involved:** crypto.js (deriveKey, generateSalt, encrypt, decrypt), MasterPasswordScreen.jsx (handleSetupSubmit, handleUnlockSubmit), api.js (setupEncryption, getEncryptionConfig), user.controller.js (setupEncryption, getEncryptionConfig)

**Flow (setup):** generateSalt → deriveKey → encrypt("VALID") → save salt + token → cache key

**Flow (unlock):** get salt + token → deriveKey → decrypt token → check "VALID" → cache key

**Interview questions:**
- Why not bcrypt? Web Crypto API doesn't support bcrypt. PBKDF2 is the only key derivation function available in browsers.
- Why 210,000 iterations? OWASP recommended value at time of implementation. Should be increased to 600,000 for current best practices.
- What prevents brute-force? The slow PBKDF2 iteration count. Combined with rate limiting (not implemented), this protects against online attacks.

## 29.3 Vault CRUD Operations

**Business goal:** Create, read, update, delete password entries

**Architecture:** REST API with Clerk JWT auth. Embedded subdocuments in MongoDB.

**Files involved:** vault.controller.js (getVault, addEntry, updateEntry, deleteEntry), vault.routes.js, api.js (fetchEntries, createEntry, updateEntry, deleteEntry), DashboardPage.jsx (CRUD handlers), EntryModal.jsx (form), ConfirmModal.jsx (delete confirmation)

**Flow:** Frontend validates → encrypts password → API call → backend verifies JWT → MongoDB operation → response → frontend updates local state

**Interview questions:**
- Why no pagination? Acceptable for personal use (few hundred entries max). Would need pagination at scale.
- Why embedded documents? Single query per user read, no joins. Tradeoff: O(n) array scan for entry lookup.
- What happens on concurrent update? Last write wins. No optimistic locking. Acceptable for single-user vault.

## 29.4 Real-Time Client-Side Search + Category Filtering

**Business goal:** Instantly filter entries without server round-trips

**Architecture:** All entries loaded client-side. JavaScript filter in useMemo.

**Files involved:** DashboardPage.jsx (filteredEntries useMemo), Navbar.jsx (search input), CategoryTabs.jsx (category pills), EntryGrid.jsx (renders filtered results)

**Interview questions:**
- Why client-side instead of server-side? Zero-knowledge architecture prevents server-side search of encrypted fields. Only label and username (plaintext) are searchable.
- Would this scale to 10,000 entries? useMemo is O(n) per keystroke. With 10,000 entries and fast typing, renders could lag. Debounce or virtual scrolling would help.

## 29.5 Event-Driven User Lifecycle Automation

**Business goal:** Automatically create/delete MongoDB user records when Clerk users sign up or delete accounts

**Architecture:** Clerk webhooks → Inngest serverless functions → MongoDB operations

**Files involved:** inngest.js (syncUser, deleteUser), server.js (Inngest endpoint), User.js (schema)

**Interview questions:**
- Why Inngest instead of direct webhook handling? Inngest provides retries, observability, and dev server. Direct handling would require manual retry logic.
- What happens if Inngest is down? Clerk queues webhooks and retries. Eventually consistent.
- Why not create Vault in syncUser? Lazy creation — Vault is created only when user sets up master password. Avoids orphan documents.

## 29.6 Password Strength Evaluator

**Business goal:** Give users real-time feedback on password quality

**Architecture:** Client-side scoring algorithm. Visual progress bar with color coding.

**Files involved:** passwordStrength.js (getPasswordStrength), EntryCard.jsx (strength bar rendering)

**Interview questions:**
- Why not use zxcvbn? zxcvbn is more accurate (detects patterns, common passwords) but larger (~30KB). Point-based system is simpler and sufficient for this use case.
- Is the strength bar calculated on plaintext or ciphertext? Plaintext (decrypted during initial load). The decrypted password exists in component state for this purpose.

---

# 30. Possible Improvements

## Architecture
- Add service layer between controllers and models
- Extract repeated User.findOne({clerkId}) into middleware
- Add global error handler that returns JSON
- Create custom useVault hook to extract state from DashboardPage

## Performance
- Add React.memo to EntryCard
- Implement search debounce (150ms)
- Add virtual scrolling (react-window) for large vaults
- Add pagination to GET /api/vault

## Security
- Add express-rate-limit on all API endpoints
- Increase PBKDF2 iterations to 600,000
- Add helmet middleware for security headers
- Add request size limits
- Implement proper input sanitization
- Rate limit GET /api/user/encryption (prevents token harvesting)

## Scalability
- Move entries to separate collection for independent CRUD
- Add database indexes on entry fields
- Implement caching layer (Redis/Upstash)

## Developer Experience
- Add TypeScript
- Add automated tests (Jest/Vitest + Playwright)
- Add GitHub Actions CI/CD
- Add Docker Compose for local development
- Add database seed scripts

## UX
- Show password generator
- Add CSV import/export
- Add dark/light theme toggle
- Add mobile-responsive improvements
- Persist unlock in sessionStorage (with warning)

---

# 31. Scalability

## At 100 Users
- No issues. Everything works as-is.
- PBKDF2 on 100 simultaneous unlocks: ~50 seconds total CPU, distributed across browsers. Server only handles API calls.

## At 10,000 Users
- **MongoDB:** No issue. 10,000 documents in each collection is trivial.
- **API throughput:** Express on Vercel serverless handles 10K requests/day easily.
- **Rate limiting needed:** Protect against brute-force.
- **Pagination needed:** GET /api/vault could return large payloads for users with many entries.
- **Inngest:** No issue. 2 webhook events per user lifecycle.

## At 100,000 Users
- **MongoDB indexing:** Current indexes sufficient. Compound indexes on entry fields may help.
- **Cold starts:** Vercel cold starts could add latency. Consider keeping functions warm.
- **Background jobs:** Inngest handles scale automatically.
- **Encryption overhead:** PBKDF2 happens client-side — no server impact.

## At 1 Million Users
- **MongoDB Atlas:** Need to scale cluster (M10+). Connection pooling matters.
- **API latency:** Serverless cold starts become noticeable. Consider provisioned concurrency.
- **Rate limiting critical:** Multiple tiers of rate limiting needed (per-user, per-IP, global).
- **Database:** Consider sharding by userId. Currently users are in one collection.

## At 10 Million Users
- **Architecture changes needed:**
  - Separate entries into own collection (document size limits become real)
  - Add Redis caching for encryption configs (salt + token)
  - Consider moving from serverless to dedicated servers (EC2, ECS)
  - Database sharding required
  - Add CDN for static assets (already on Vercel edge)
  - Implement write-through cache for vault operations
- **What would break first:** Embedded document size (16MB cap). With 500 bytes per entry, 32,000 entries × 10M users = some will hit the limit.

## What Would Break First
1. No rate limiting → brute-force attacks succeed
2. No pagination → large vaults slow down UI
3. Embedded document size → users with thousands of entries hit 16MB cap
4. Serverless cold starts → noticeable latency on infrequent access

---

# 32. Interview Questions

## 32.1 Beginner Questions (50)

1. What is React used for in this project?
2. What is Express used for?
3. What database does Zero Vault use?
4. What is MongoDB Atlas?
5. What is an API endpoint?
6. What is CORS and why is it needed?
7. What is JWT?
8. What does the .env file contain?
9. What is npm?
10. What is package.json?
11. What is Git used for?
12. What is a pull request?
13. What is JSX?
14. What is a component in React?
15. What is state in React?
16. What is a prop?
17. What is useState?
18. What is useEffect?
19. What is useMemo?
20. What is useRef?
21. What is conditional rendering?
22. What is an event handler?
23. What is a form in React?
24. What is client-side routing?
25. What is a SPA?
26. What is Vite?
27. What is Tailwind CSS?
28. What is middleware in Express?
29. What is a controller?
30. What is a model?
31. What is a schema in MongoDB?
32. What is a subdocument?
33. What is a callback function?
34. What is an async function?
35. What is a Promise?
36. What is fetch()?
37. What is localStorage?
38. What is encryption?
39. What is the difference between HTTP and HTTPS?
40. What is a webhook?
41. What is a background job?
42. What is Vercel?
43. What is serverless?
44. What is environment variables?
45. What is a module in JavaScript?
46. What is import/export?
47. What is destructuring?
48. What is the spread operator?
49. What is a REST API?
50. What is a 401 status code?

## 32.2 Intermediate Questions (50)

51. How does PBKDF2 work?
52. What is AES-256-GCM?
53. What is an initialization vector (IV)?
54. Why does each encryption need a unique IV?
55. What is authenticated encryption?
56. What is the difference between hashing and encryption?
57. How does the verification token pattern work?
58. Why is the encryption key non-extractable?
59. What are the Web Crypto API functions used?
60. What is a salt in cryptography?
61. Why use 210,000 iterations for PBKDF2?
62. How does Clerk JWT authentication work?
63. What is the difference between Clerk and Auth0?
64. How does requireAuth middleware work?
65. What is the difference between req.auth.userId and MongoDB _id?
66. How does Mongoose handle embedded subdocuments?
67. What is vault.Entries.pull()?
68. How does CORS origin validation work?
69. Why is createEntry idempotent?
70. How does the on-demand decryption pattern work?
71. Why is the password stored as _ciphertext?
72. How does useMemo optimize search filtering?
73. What happens when appMode changes?
74. How does the lazy vault initialization work?
75. How does the EntryModal form reset work?
76. Why use a key prop on EntryModal?
77. How does backdrop click close a modal?
78. What is prop drilling in EntryGrid?
79. Why no global state management?
80. How does Inngest handle Clerk webhooks?
81. What happens if Inngest syncUser fails?
82. Why is connectDB() called inside Inngest functions?
83. How does the password strength algorithm work?
84. What are the weaknesses of the strength algorithm?
85. How does base64 encoding work?
86. Why use base64 instead of hex?
87. How are fonts loaded in index.html?
88. What does vercel.json do for the frontend?
89. What does vercel.json do for the backend?
90. How does a SPA handle direct URL navigation?
91. What are the security headers missing?
92. How does the error handling in api.js work?
93. Why is argon2 installed but unused?
94. What are the two dead schema fields?
95. How does the startup sequence handle DB connection failure?
96. Why is there no pagination?
97. How would you add pagination?
98. What is the 16MB document size limit concern?
99. How does the lazy loading pattern work?
100. What would happen if a user opens two tabs?

## 32.3 Advanced Questions (50)

101. Explain the complete encryption flow from master password to stored ciphertext.
102. Why is it safe to store the verification token on the server?
103. What would happen if someone modified the ciphertext in the database?
104. How would you implement password reset in a zero-knowledge system?
105. What are the security implications of storing encryptionSalt on the server?
106. How does AES-GCM authentication tag work?
107. What is the attack surface for the verification token endpoint?
108. How would you rate limit the GET /api/user/encryption endpoint?
109. What is the timing attack risk on the unlock endpoint?
110. How would you implement key rotation?
111. What happens to existing entries when the master password changes?
112. How would you implement shared vaults between users?
113. What are the tradeoffs of embedded vs. referenced entry storage?
114. How would you migrate from embedded to referenced entries?
115. What is the N+1 query problem and how is it avoided here?
116. How would you implement server-side search across encrypted data?
117. What is the cold start problem in serverless and how does it affect this app?
118. How would you keep serverless functions warm?
119. What are the CORS tradeoffs in the current implementation?
120. How would you implement a secure password generator?
121. How would you implement CSV import?
122. What is the XSS attack surface in this app?
123. How would you add Content Security Policy headers?
124. How would you implement session persistence for the encryption key?
125. What are the tradeoffs of sessionStorage vs. in-memory for the encryption key?
126. How does the React component tree re-render when an entry is added?
127. How would you optimize re-renders with React.memo?
128. How would you implement virtual scrolling for large vaults?
129. What is the render-before-data pattern and why is it relevant here?
130. How would you add TypeScript to this project?
131. What is the ESLint config doing?
132. How does the Vite build process work?
133. How would you add automated tests?
134. What would you test in the crypto module?
135. How would you test the API endpoints?
136. How would you mock Clerk authentication in tests?
137. How would you test the MasterPasswordScreen component?
138. What is the difference between unit, integration, and E2E tests for this project?
139. How would you set up a CI/CD pipeline?
140. How would you implement database migrations?
141. How would you handle user data export (GDPR)?
142. How would you implement account deletion that cascades to Vault?
143. What is the current error handling gap at the Express level?
144. How would you implement a global error handler?
145. How would you add request validation middleware?
146. Why is there no Zod or Joi dependency?
147. How would you implement rate limiting?
148. What is the difference between cors() and helmet()?
149. How would you implement a health check endpoint?
150. How would you monitor API performance?

## 32.4 Staff Engineer Questions (50)

151. Design an architecture that supports 10 million users.
152. How would you redesign the data model for team sharing?
153. Design a strategy to migrate from embedded to referenced entries with zero downtime.
154. How would you implement end-to-end encryption for shared vaults?
155. Design a key escrow system that allows password recovery without breaking zero-knowledge.
156. How would you implement a browser extension using the same architecture?
157. Design a protocol for syncing vault changes across multiple devices.
158. How would you handle conflict resolution when two devices modify the same entry?
159. Design a cryptographic protocol for sharing individual entries without sharing the master key.
160. How would you implement a password health report (reused, weak, compromised passwords)?
161. Design a system to check passwords against HaveIBeenPwned without leaking them.
162. How would you implement an offline mode?
163. Design a disaster recovery plan for the database.
164. How would you implement audit logging for vault operations?
165. Design a permission system for team vaults.
166. How would you handle a Clerk outage?
167. Design a caching strategy for the API layer.
168. How would you implement WebSocket-based real-time sync?
169. Design a strategy for reducing serverless cold start latency.
170. How would you implement database sharding by userId?
171. Design a monitoring and alerting system.
172. How would you implement A/B testing for UI changes?
173. Design a feature flag system.
174. How would you implement a public API for third-party integrations?
175. Design an OAuth flow for external app access to the vault.
176. How would you implement multi-factor authentication for vault unlock?
177. Design a system for emergency access (break-glass) to vault.
178. How would you implement secure notes (rich text with encryption)?
179. Design a protocol for automatic credential change detection.
180. How would you implement a browser autofill extension?
181. Design a secure import mechanism from other password managers.
182. How would you implement biometric unlock (Touch ID / Face ID)?
183. Design a system for credential sharing with expiry.
184. How would you implement a desktop app using Electron?
185. Design a migration strategy from MongoDB to PostgreSQL.
186. How would you implement full-text search across encrypted entries?
187. Design a protocol for zero-knowledge proof of password strength.
188. How would you implement a password generation algorithm?
189. Design a secure random number generation fallback for older browsers.
190. How would you implement progressive web app (PWA) support?
191. Design a system for detecting compromised master passwords.
192. How would you implement user session management across devices?
193. Design a strategy for rotating the encryption salt.
194. How would you implement a quarantine mechanism for suspicious entries?
195. Design a system for credential health scoring.
196. How would you implement automated credential rotation for supported services?
197. Design a protocol for emergency credential access by designated heirs.
198. How would you implement a CLI tool for vault management?
199. Design a strategy for maintaining zero-knowledge while enabling AI-powered features.
200. How would you implement the entire system as a local-first application?

## 32.5 System Design Questions (50)

201. Design a password manager from scratch.
202. Design a key derivation system that balances security and UX.
203. Design a zero-knowledge authentication protocol.
204. Design a multi-device sync system for encrypted data.
205. Design a secure credential sharing system.
206. Design a system that can detect credential breaches without leaking them.
207. Design a rate limiting system for authentication endpoints.
208. Design a database schema for a password manager that supports teams.
209. Design a backup and restore system for encrypted vaults.
210. Design a monitoring system for a production password manager.
211. Design a deployment pipeline for a zero-knowledge application.
212. Design a disaster recovery plan for encrypted user data.
213. Design an API for external password manager integrations.
214. Design a secure import/export format for credentials.
215. Design a browser extension architecture for credential autofill.
216. Design a mobile app architecture that reuses the existing encryption.
217. Design a system for detecting and alerting on suspicious login attempts.
218. Design a token refresh mechanism for long-lived sessions.
219. Design a caching layer for frequently accessed vault entries.
220. Design a webhook system for vault events.
221. Design a credential health scoring algorithm.
222. Design a system for automatic credential updates.
223. Design a secure password generation service.
224. Design a search system for encrypted credentials.
225. Design a CRDT-based sync protocol for vault entries.
226. Design a federation protocol between different password managers.
227. Design a zero-knowledge proof system for credential verification.
228. Design a key ceremony for enterprise password management.
229. Design a secure audit log for credential access.
230. Design a system for time-limited credential sharing.
231. Design a hot-reload system for encryption parameters.
232. Design a migration system for upgrading encryption algorithms.
233. Design a system that supports multiple encryption keys per vault.
234. Design a secure memory management system for cryptographic keys.
235. Design a system for detecting and preventing side-channel attacks.
236. Design a CAPTCHA system for vault unlock attempts.
237. Design a notification system for security events.
238. Design a system for emergency credential access by trusted contacts.
239. Design a delegation system for credential management.
240. Design a system that works with hardware security keys (WebAuthn).
241. Design a compliance system for SOC2/ISO27001 certification.
242. Design a system for handling government data requests.
243. Design a secure client-side logging system.
244. Design a system for detecting anomalous vault access patterns.
245. Design a system that prevents offline brute-force attacks on exported data.
246. Design a credential rotation reminder system.
247. Design a system for syncing vault changes across browser tabs.
248. Design a system for lazy-loading vault entries as the user scrolls.
249. Design a system for encrypting vault metadata (labels, URLs).
250. Design a system that allows selective decryption of individual entries.

---

# 33. Resume Questions

## Common Resume Screening Questions

1. What was the hardest technical problem you solved?
2. Why did you choose React over Vue/Angular?
3. Why did you choose MongoDB over PostgreSQL?
4. How did you ensure security in your password manager?
5. What would you do differently if you built it again?
6. How did you handle authentication?
7. What is the most interesting part of the architecture?
8. How many users does it support?
9. How long did it take to build?
10. Is it deployed? Where?

## Behavioral Questions

11. Tell me about a time you made a technical tradeoff.
12. Tell me about a bug that was hard to find.
13. How do you stay updated on security best practices?
14. Tell me about a time you had to learn a new technology quickly.
15. How do you approach designing a new feature?
16. Tell me about a time you disagreed with a design decision.
17. How do you handle technical debt?
18. Tell me about a time you had to debug a production issue.
19. How do you ensure code quality in your projects?
20. Tell me about your development workflow.

## Architecture Questions

21. Why separate frontend/backend projects instead of monorepo?
22. Why two Vercel deployments instead of one?
23. Why serverless instead of a VPS?
24. Why embedded documents instead of separate collection?
25. Why zero-knowledge architecture instead of server-side encryption?
26. Why Clerk over Auth0 or Firebase Auth?
27. Why Inngest over BullMQ or direct webhook handling?
28. Why client-side search instead of server-side?
29. Why React state for encryption key instead of sessionStorage?
30. Why no TypeScript?

## Design Decision Questions

31. Why is the username stored in plaintext?
32. Why is the verification token not rate limited?
33. Why no password reset capability?
34. Why 210,000 PBKDF2 iterations instead of 600,000?
35. Why argon2 as a dependency if it is unused?
36. Why no automated tests?
37. Why the lazy vault creation pattern?
38. Why the on-demand decryption pattern?
39. Why no pagination on GET /api/vault?
40. Why CORS endsWith(.vercel.app) instead of strict whitelist?

## Failure/Lesson Questions

41. What would you improve about the security?
42. What is the biggest security vulnerability?
43. What feature would you add next?
44. What would you refactor first?
45. What would you do differently in the database design?
46. What would you change about the deployment?
47. What would you add to make it production-ready for 10K users?
48. What testing strategy would you implement?
49. How would you handle the key persistence problem?
50. What would you do about the dead code (argon2, unused schema fields)?

---

# 34. Defend the Project

## Attack: "The PBKDF2 iteration count is too low."
**Defense:** You are correct that OWASP 2023 recommends 600,000 iterations. However, 210,000 was the recommendation when this was built, and it still provides meaningful protection. Each guess requires ~100ms on modern hardware, limiting online attacks to ~10 guesses/second. Combined with rate limiting (which I would add in production), this is sufficient for a personal password manager. The iteration count is a configuration parameter and can be increased without data migration since the key is derived from the password + salt, not from previous derivations.

## Attack: "The server has no rate limiting."
**Defense:** This is a known gap. For a deployed production service, I would add express-rate-limit with different tiers: strict limits on /api/user/encryption (5 requests/minute), moderate on auth endpoints, and generous on vault CRUD. In the current implementation, Clerk handles authentication rate limiting server-side, protecting the most sensitive path (login). The remaining endpoints require a valid JWT, which limits anonymous attacks.

## Attack: "Username is stored in plaintext. That is a privacy issue."
**Defense:** Correct — usernames are stored unencrypted. This was a deliberate tradeoff. The client-side search and filter features require plaintext fields for matching. Encrypting all fields would require either server-side decryption (breaking zero-knowledge) or downloading and decrypting all entries before searching (which is what currently happens for passwords). Usernames are generally not secrets (they are often email addresses that appear elsewhere), so the risk is acceptable. For users who need username privacy, the notes field or a future "encrypt all" mode could be added.

## Attack: "No automated tests. How do you know it works?"
**Defense:** This is a solo portfolio project built in ~6 days. Testing was deprioritized to focus on the core encryption protocol and UI. The encryption functions are pure and well-suited for unit tests. The API endpoints follow consistent patterns that would be easy to test with supertest. In a production context, I would prioritize: (1) crypto.js unit tests (roundtrip encryption, key derivation determinism), (2) API integration tests, (3) component tests for critical flows (setup, unlock, CRUD). I have designed the code with testability in mind — pure utility functions, separated concerns, explicit dependencies.

## Attack: "No TypeScript. This is risky for a security-sensitive app."
**Defense:** JavaScript with careful practices can be secure. The crypto module is 4 exported functions with explicit types documented in JSDoc comments. The biggest risk is type confusion in API responses, which is mitigated by consistent response shapes. TypeScript would add compile-time safety and better IDE support, and I would add it in a production version. However, for a solo project where I control both frontend and backend, the overhead of TypeScript setup was not justified for the development speed needed.

## Attack: "The encryption key is lost on page refresh. That is bad UX."
**Defense:** This is a deliberate security-over-convenience decision. Storing the key in sessionStorage would survive page refreshes but makes it accessible to any JavaScript running in the same origin (including third-party scripts and XSS attacks). Keeping the key only in React memory means it is destroyed when the page unloads. The tradeoff is that the user must re-enter their master password on refresh. For a password manager, this is standard behavior (like 1Password or Bitwarden locking after idle).

## Attack: "No password reset capability means users can be locked out forever."
**Defense:** This is an inherent property of zero-knowledge systems — if the server cannot read the encryption key, it cannot reset it. User education about backup options is essential. Solutions include: (1) printing a recovery code during setup, (2) key escrow with a trusted party, (3) emergency access kit. Zer0 Vault currently has none of these — they are planned for future releases. For now, users must understand that losing their master password means losing access to their vault.

## Attack: "Why not use WebAuthn or Passkeys instead of a master password?"
**Defense:** The encryption key must be derived from something the user knows (or has). A passkey (hardware-bound key) could be used to derive the encryption key, making it device-specific. The master password approach was chosen for simplicity and cross-device compatibility — the user can access their vault from any device by remembering one password. WebAuthn integration is a planned improvement that would allow biometric unlock while keeping the zero-knowledge architecture.

## Attack: "CORS policy is too permissive with .vercel.app wildcard."
**Defense:** This was a pragmatic choice to support Vercel preview deployments without updating configuration for each PR. The risk is limited because: (1) CORS does not prevent server-side request forgery — it only prevents browsers from reading responses, (2) protected endpoints still require valid Clerk JWT, (3) the server can still be called directly (not through browser) regardless of CORS. In production, a strict whitelist would be preferred.

---

# 35. Hidden Details

## Easy to Miss Observations

1. **clerkClient is imported but never used** in inngest.js (line 4). This is dead code.

2. **argon2 is a dependency but never called.** The package.json includes it, and the User schema has masterPasswordHash and salt fields ready for it, but no code path uses it.

3. **The backend scripts/ directory is empty.** It exists as a placeholder for seed scripts or migrations but was never populated.

4. **The verification token format is `ciphertext:iv` with a colon separator.** If the base64 ciphertext or IV contains a colon (possible in base64), the split in handleUnlockSubmit would break. Base64 uses A-Z, a-z, 0-9, +, /, = — colon is not a base64 character, so this is safe.

5. **Password strength is calculated on the decrypted plaintext password.** The entry.password field in the DashboardPage entries array is the decrypted value (set during initial load). This means the plaintext password exists in JavaScript memory for the lifetime of the component.

6. **The backend has no global error handler middleware.** Express 5's default error handler returns HTML for unhandled errors, not JSON. Any unhandled error would break the API contract.

7. **connectDB() is called without await in server.js.** The server starts accepting requests before the database connection is established. Mongoose buffers queries during this window, but if the connection fails, the server runs with no database.

8. **The encryption salt is hex-encoded but passed through TextEncoder.encode() as UTF-8.** This means the salt bytes are the ASCII values of hex characters, not the raw hex bytes. This is consistent (both generation and derivation use the same encoding) so it works correctly, but it is a subtle implementation detail.

9. **The IV is generated as `new Uint8Array(12)` and then `iv.buffer` is passed to arrayBufferToBase64.** For a Uint8Array created with a specific length, the underlying ArrayBuffer is exactly that length, so this is safe. However, for subarrays or slices, iv.buffer could be larger than the view.

10. **The Learn More button on HomePage has no onClick handler.** It is a static UI element.

11. **The Filter and Sort buttons in VaultHeader have no onClick handlers.** They are UI placeholders.

12. **The `key={editingEntry?._id ?? "add"}` prop on EntryModal ensures React unmounts/remounts the component** when switching between add and edit modes. This resets all internal state (form, errors) without needing manual cleanup.

13. **The `deleteTarget` state is set before `confirmDelete` is called.** If the modal is dismissed (setDeleteTarget(null)), the pending deletion is cancelled. This is a lightweight optimistic pattern.

14. **The app has no loading state for EntryModal form submission.** When the user clicks Save, the button doesn't show a loading state. If the async operation takes time, the user might click again.

15. **useEffect #2 in DashboardPage has no cleanup function.** If the component unmounts while entries are loading, the state update on unmounted component could cause a React warning. The `if(appMode !== 'ready') return` guard prevents this for mode changes but not for component unmount.

16. **The `requireAuth` middleware is applied at the Router level**, not at the individual route level. This is cleaner but means ALL routes in those routers require auth. The Inngest endpoint is at /api/inngest (not under requireAuth) so webhooks work without auth.

17. **The CORS check for FRONTEND_URL uses === (exact match)**, while the Vercel check uses endsWith. This means the exact production URL is required for the explicit check, but any .vercel.app subdomain passes the wildcard check.

18. **Mongoose `pull()` on subdocuments** uses the `$pull` MongoDB operator under the hood, which removes all matching subdocuments. Since _id is unique within the array, this is safe.

19. **The base64 decode function uses `atob()`**, which is available in all modern browsers but not in Node.js without a polyfill. Since this code runs only in the browser, this is fine.

20. **The crypto functions are async** but the base64 helpers are synchronous. The encryption/decryption operations (Web Crypto API) are async, but the conversion between ArrayBuffer and base64 is synchronous.

---

# 36. Reverse Engineering

If someone had only the compiled/built project (frontend/dist/), they could infer:

1. **React SPA with Vite:** From the built files, module format, and hashed filenames.

2. **Tailwind CSS:** From the generated utility classes in the CSS output.

3. **Clerk Authentication:** From the PostMessage communication with Clerk domains, presence of @clerk/clerk-react in bundled code.

4. **Web Crypto API:** From calls to crypto.subtle.encrypt, crypto.subtle.decrypt, crypto.subtle.deriveKey, crypto.subtle.importKey (visible in source maps if not disabled).

5. **API endpoints:** From the fetch calls in the bundled code — reveals /api/vault, /api/user/encryption, and the request/response shapes.

6. **Data model:** From the API request bodies — reveals fields: label, username, password, url, category, notes, iv.

7. **Encryption algorithm:** From the bundled crypto.js code (if source maps are enabled) — reveals PBKDF2 iterations, AES-GCM usage, IV length, salt generation.

8. **Component structure:** From the component tree inferred by React DevTools or by analyzing the bundled module graph.

9. **Routing:** From the React Router configuration.

**What cannot be inferred:**
- The actual encryption key (never stored or transmitted)
- User passwords (encrypted before transmission)
- MongoDB connection string (server-side only)
- Clerk secret keys (server-side only)
- Inngest signing keys (server-side only)
- The verification token pattern (the actual encrypted "VALID" string is random-looking ciphertext)

---

# 37. Code Ownership

If I became the new owner of this project, my priorities would be:

## Immediate Fixes (Week 1)
1. Add null check on user.findOne results in controllers (prevents crashes)
2. Replace User.create() in syncUser with findOneAndUpdate + upsert (prevents duplicate key errors)
3. Remove dead code: unused clerkClient import, unused argon2 reference, unused masterPasswordHash/salt logic
4. Add global error handler middleware that returns JSON
5. Add rate limiting on sensitive endpoints
6. Add EntryModal loading state (prevents double-submit)

## Short-Term (Month 1)
1. Add automated tests: crypto.js unit tests, API integration tests
2. Add React.memo to EntryCard
3. Extract User.findOne pattern into reusable middleware
4. Add TypeScript for type safety
5. Increase PBKDF2 iterations to 600,000
6. Add helmet middleware for security headers
7. Set up GitHub Actions CI/CD

## Medium-Term (Quarter 1)
1. Extract useVault custom hook from DashboardPage
2. Add pagination to GET /api/vault
3. Implement search debounce (150ms)
4. Add password generator feature
5. Add CSV import/export
6. Add end-to-end tests with Playwright
7. Add comprehensive error states and loading skeletons

## Long-Term (Year 1)
1. Consider migrating entries to separate collection for scalability
2. Add team vault sharing with per-entry encryption
3. Implement browser extension
4. Add WebAuthn/biometric support
5. Implement offline mode with IndexedDB
6. Add desktop app with Electron/Tauri
7. Implement P2P sync for cross-device access

## Technical Debt to Address
- Repeated User.findOne pattern (DRY violation)
- Inconsistent error handling
- No request validation on backend
- No pagination
- No TypeScript
- No automated tests
- No CI/CD
- Unused dependencies and dead code
- Missing cleanup functions in useEffect
- No loading state on EntryModal submission
- Server starts before DB connection

---

# 38. Knowledge Graph

## Node Connections

**server.js** connects to:
- config/db.js (MongoDB connection)
- config/inngest.js (background job definitions)
- middleware/auth.middleware.js (JWT guard)
- routes/user.routes.js (encryption endpoints)
- routes/vault.routes.js (vault CRUD endpoints)

**user.controller.js** connects to:
- models/User.js (schema → encryptionSalt, verificationToken)
- models/Vault.js (schema → userId, Entries)

**vault.controller.js** connects to:
- models/User.js (schema → clerkId)
- models/Vault.js (schema → userId, Entries)

**inngest.js** connects to:
- config/db.js (MongoDB for each serverless invocation)
- models/User.js (schema → clerkId, email)
- @clerk/express (dead import)

**main.jsx** connects to:
- App.jsx (root component)
- @clerk/clerk-react (ClerkProvider)
- react-router-dom (BrowserRouter)

**App.jsx** connects to:
- pages/HomePage.jsx (landing page)
- pages/DashboardPage.jsx (vault management)
- @clerk/clerk-react (useUser)
- react-router-dom (Routes, Route, Navigate)

**DashboardPage.jsx** connects to:
- components/Navbar.jsx (search)
- components/VaultHeader.jsx (entry count)
- components/CategoryTabs.jsx (filter)
- components/EntryGrid.jsx → EntryCard.jsx (entry display, on-demand decrypt)
- components/EntryModal.jsx (add/edit form)
- components/ConfirmModal.jsx (delete confirmation)
- components/MasterPasswordScreen.jsx (setup/unlock)
- components/AddEntryButton.jsx (FAB)
- services/api.js (all 6 endpoints)
- utils/crypto.js (deriveKey, encrypt, decrypt)
- @clerk/clerk-react (useAuth, getToken)

**MasterPasswordScreen.jsx** connects to:
- utils/crypto.js (deriveKey, generateSalt, encrypt, decrypt)
- services/api.js (setupEncryption)
- @clerk/clerk-react (useAuth, getToken)

**EntryCard.jsx** connects to:
- utils/crypto.js (decrypt)
- utils/passwordStrength.js (getPasswordStrength)

**crypto.js** connects to:
- Web Crypto API (window.crypto.subtle)

**api.js** connects to:
- Fetch API
- VITE_API_URL environment variable

---

# 39. Cheat Sheet

## 10-Minute Revision

**What is it:** Zero-knowledge password manager. Client-side AES-256-GCM encryption. Server stores only ciphertext.

**Stack:** React 19, Express 5, MongoDB, Clerk, Inngest, Vercel, Tailwind CSS 4, Web Crypto API.

**Encryption Flow:** Master password → PBKDF2 (210,000 iterations, SHA-256) → AES-256-GCM key → encrypt credentials → ciphertext to server.

**Verification Token:** encrypt("VALID") with derived key → store ciphertext:IV. On unlock, decrypt token → check for "VALID".

**API:** 6 endpoints (GET/PUT /user/encryption, GET/POST /vault, PUT/DELETE /vault/:entryId).

**Key Pattern:** On-demand decryption — passwords decrypted only when Copy is clicked.

**Main Gaps:** No rate limiting, no pagination, no TypeScript, no tests, no password reset.

## 30-Minute Revision

**Architecture:** MVC-lite backend, lifted state frontend, embedded subdocuments in MongoDB, Vercel dual deployment.

**Crypto Details:** Salt = 16 bytes CSPRNG, hex encoded. IV = 12 bytes per entry. Key = non-extractable. Base64 for storage.

**Auth Layers:** Clerk frontend SDK → Clerk backend middleware → requireAuth gate.

**Background Jobs:** Inngest triggered by Clerk webhooks (user.created, user.deleted). Each function opens its own DB connection.

**Security Model:** Server never sees master password, derived key, or plaintext credentials. Can only store/retrieve ciphertext.

**Component Architecture:** DashboardPage (state owner) → child components via props. 9 components, 2 pages, 2 utilities, 1 service module.

**Database:** 2 collections (User, Vault). User has clerkId+email+crypto fields. Vault has userId+embedded Entries array.

## 1-Hour Revision

**Design Patterns:** Provider (Clerk), lifting state up, facade (crypto), MVC-lite, lazy initialization, on-demand decryption, callback pattern, conditional rendering.

**State Management:** 12 state variables in DashboardPage. encryptionKey is most critical — lives only in React state (not persisted). appMode controls 4 states: loading/setup/unlock/ready.

**Data Flow:** User input → encrypt(client-side) → API(JWT auth) → Controller → MongoDB → Response → Decrypt(client-side) → Display. On Copy: decrypt on demand → clipboard.

**Security Weaknesses:** No rate limiting (medium), PBKDF2 210k vs 600k (low), no security headers (low), no input validation (low), dead schema fields (low).

**CORS:** Origin validation: no origin → allow, .vercel.app → allow, localhost:5173 → allow, FRONTEND_URL → allow, everything else → deny.

**Key Interview Numbers:**
- PBKDF2 iterations: 210,000 (OWASP 2017; current: 600,000)
- AES key size: 256 bits
- IV length: 12 bytes (96 bits)
- Salt length: 16 bytes (128 bits)
- API endpoints: 6
- Frontend components: 11
- Pages: 2
- Database collections: 2
- Background jobs: 2
- Build time: ~6 days
- Commits: 32

## Night-Before-Interview Revision

**Three-sentence pitch:** Zero Vault is a zero-knowledge password manager that encrypts credentials client-side using AES-256-GCM with keys derived from the master password via PBKDF2 (210K iterations, SHA-256). The server stores only ciphertext and is architecturally incapable of reading user data — a verification token pattern proves password correctness without transmitting secrets. Built with React 19, Express 5, MongoDB, and Clerk, deployed as dual Vercel projects.

**Five defending points:**
1. "Why embedded documents?" — Single query per user, eliminates N+1, appropriate for personal vault with <32K entries.
2. "Why no password reset?" — Inherent to zero-knowledge. User education is the solution.
3. "Why client-side encryption?" — Eliminates server as trust boundary. Server compromise does not expose secrets.
4. "Why React state for key?" — Security: key destroyed on page refresh. sessionStorage would persist it through XSS.
5. "Why 210,000 iterations?" — OWASP guidance at time of building. Easy to increase. Provides ~100ms/guess.

**Three things to never say:**
1. "The encryption is unbreakable" — Nothing is unbreakable. PBKDF2 slows brute-force, does not prevent it.
2. "It is production-ready for millions" — It works, but needs rate limiting, pagination, and testing for scale.
3. "I built everything from scratch" — Clerk handles auth, Inngest handles queues, Vercel handles hosting. The value is the integration and crypto protocol.

**Three things to always mention:**
1. The verification token pattern — creative use of AES-GCM authenticated encryption.
2. The zero-knowledge architecture — server cannot decrypt even if compromised.
3. The on-demand decryption pattern — plaintext exists in memory only during Copy action.

---

# 40. Final Interview Handbook

## Project Summary

Zero Vault is a full-stack zero-knowledge password manager where all credential encryption happens client-side using the Web Crypto API (AES-256-GCM, PBKDF2-SHA-256). The server is architecturally incapable of reading user data. Built solo in ~6 days (32 commits), deployed on Vercel as two separate projects (React SPA + Express serverless API).

## Architecture Summary

```
[Browser: React + Web Crypto + Clerk SDK] → REST API → [Express + Clerk JWT] → [MongoDB Atlas]
                                              ↓
                                       [Inngest Background Jobs]
                                       (Clerk webhooks: user.created, user.deleted)
```

## Important Files

| File | Why It Matters |
|---|---|
| crypto.js | Core encryption logic — PBKDF2, AES-GCM, base64 |
| MasterPasswordScreen.jsx | Zero-knowledge unlock protocol implementation |
| vault.controller.js | Embedded document CRUD pattern |
| auth.middleware.js | JWT verification and user identification |
| DashboardPage.jsx | State orchestrator — all state management patterns |
| inngest.js | Event-driven background jobs |

## Key Buzzwords

- Zero-knowledge architecture
- Client-side encryption
- AES-256-GCM authenticated encryption
- PBKDF2 key derivation
- Verification token pattern
- On-demand decryption
- Embedded subdocument pattern
- Serverless deployment
- Event-driven background jobs
- JWT authentication

## STAR Stories

**S — Situation:** Building a password manager that cannot read user passwords.
**T — Task:** Design a verification mechanism that proves password correctness without transmitting the password or key.
**A — Action:** Implemented a verification token pattern: encrypt the string "VALID" with the derived key during setup, store only the ciphertext+IV server-side. On unlock, re-derive the key and attempt decryption. AES-GCM authenticated encryption ensures wrong keys produce decryption errors.
**R — Result:** The server can verify password correctness without ever seeing the password, derived key, or any reversible form of either.

**S — Situation:** Running two separate Vercel deployments with different origins.
**T — Task:** Configure CORS to allow the SPA while maintaining security.
**A — Action:** Implemented a custom origin validation function that allows Vercel deployments, localhost dev server, and the explicit production URL — while denying all other origins.
**R — Result:** CORS works for development, preview deployments, and production without exposing the API to arbitrary cross-origin requests.

**S — Situation:** Managing user lifecycle across Clerk and MongoDB.
**T — Task:** Automatically create and delete MongoDB user records when users sign up or delete accounts via Clerk.
**A — Action:** Integrated Inngest event-driven background jobs triggered by Clerk webhooks. Two functions handle clerk/user.created and clerk/user.deleted events, synchronizing data to MongoDB.
**R — Result:** User provisioning and deprovisioning is fully automated — no manual database management needed.

## Strengths to Emphasize

1. Deep understanding of browser-native cryptography (Web Crypto API)
2. Security-conscious design patterns (on-demand decryption, non-extractable keys, zero-knowledge architecture)
3. Full-stack capability (React, Express, MongoDB, deployment)
4. Third-party integration skills (Clerk, Inngest, Vercel)
5. Clean separation of concerns (MVC-lite, pure utility functions)

## Weaknesses to Admit Honestly

1. No automated tests (tradeoff for rapid solo development — would add in production)
2. No TypeScript (acceptable for solo project, would add for team)
3. No rate limiting (known gap — would add for production deployment)
4. PBKDF2 iterations at 210K vs current 600K recommendation (easy to fix)
5. Encryption key lost on page refresh (deliberate security decision, but hurts UX)

## Things to Never Say

1. "My encryption is unbreakable" — Say: "PBKDF2 with 210K iterations provides strong brute-force resistance, and I would increase to 600K per OWASP 2023."
2. "The server cannot see anything" — Say: "The server sees encrypted ciphertext. It is architecturally incapable of reading plaintext without the client-side key."
3. "I built everything myself" — Say: "I integrated Clerk for authentication, Inngest for background jobs, and Vercel for hosting — but designed and implemented the encryption protocol, API, data model, and UI myself."
4. "It is production-ready" — Say: "It works in production for personal use. For enterprise scale, I would add rate limiting, pagination, TypeScript, and comprehensive testing."
5. "Security through obscurity" — Say: "The security relies on well-audited algorithms (AES-256-GCM, PBKDF2-SHA-256) and the zero-knowledge architecture, not on hiding implementation details."
