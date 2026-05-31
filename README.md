<p align="center">
  <strong>⚡ LIVEBID.PRO</strong>
</p>

<p align="center">
  <em>AI-Powered Auction Intelligence Terminal — Monte Carlo Simulations, Real-Time Market Intelligence, Game Theory Analysis & Secure Full-Stack Architecture</em>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-10b981?style=flat-square" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-15+-4169e1?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini_2.0_Flash-AI-8b5cf6?style=flat-square&logo=google&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square" />
</p>

---

## Overview

**LiveBid.Pro** is a full-stack auction intelligence platform that combines AI-powered market analysis with Monte Carlo simulations and game theory to give bidders a strategic edge at high-stakes auctions. It features a premium, dark-mode terminal-inspired UI with real-time WebSocket connectivity, a secure Express.js backend, and PostgreSQL persistence.

---

## Architecture

```
┌───────────────────────────────────────────┐
│           React Frontend (SPA)            │
│     Vite + React Router + Recharts        │
│  Vercel (prod) │ localhost:5173 (dev)      │
├───────────────────────────────────────────┤
│           /api proxy (rewrites)           │
├───────────────────────────────────────────┤
│          Express.js Backend API           │
│  REST + WebSocket + JWT + Rate Limiting   │
│  Render (prod) │ localhost:3001 (dev)      │
├───────────────────────────────────────────┤
│       Google Gemini 2.0 Flash (AI)        │
│  Structured JSON Schema │ Strategy Engine │
├───────────────────────────────────────────┤
│             PostgreSQL (DB)               │
│  Users │ Auctions │ Bids │ Simulations    │
│         Indexed │ SSL in Prod             │
└───────────────────────────────────────────┘
```

---

## Tech Stack

| Layer        | Technology                                                    |
|--------------|---------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, React Router 6, Recharts 2, Lucide Icons   |
| **Styling**  | Vanilla CSS Design System (custom properties, animations)     |
| **Backend**  | Node.js, Express 4, TypeScript 5.6                            |
| **Database** | PostgreSQL (via `pg` driver), SQL migrations                  |
| **Auth**     | JWT (`jsonwebtoken`) + bcrypt (12-round hashing)              |
| **AI**       | Google Gemini 2.0 Flash (`@google/genai`) — server-side only  |
| **Real-time**| WebSocket (`ws`) with JWT-authenticated connections            |
| **Security** | Helmet, CORS, multi-tier rate limiting, API key isolation     |
| **DevOps**   | Docker (multi-stage), npm Workspaces, Vercel + Render         |
| **Dev Tools**| tsx (hot-reload), concurrently, TypeScript strict mode         |

---

## Features

### 🎯 War Room — Monte Carlo Simulation Engine
- Configure asset identifier, fair market value, hard limit (personal ceiling), and competitor density (1–5 nodes)
- Runs up to **5,000 Monte Carlo iterations** per analysis with English auction mechanics
- **Convergence Analysis Chart** — real-time area chart tracking price convergence across simulation rounds
- **Profitability Frontier Chart** — composed bar/line chart mapping margin vs. risk at different price points
- **Combat Console** — manual bid adjustments (+$50, +$250, +$500 jump bids) with live position tracking
- **Market Heat Index** — dynamic progress bar with FOMO detection and warning thresholds
- **Active Neural Nodes** — visual competitor profiles with risk factor gauges and target valuations
- **Strategic Briefing** — AI-generated bidding strategy report with recommended opening bid, timing, and tactical maneuvers
- **Adversarial Threat Matrix** — risk assessment for Winner's Curse, Shill Detection, and Node Exhaustion
- **Grounding Points** — linked external source references from AI analysis
- **Tactical Log** — timestamped scrollable event log with terminal aesthetics

### 🌐 Global Feed — AI-Powered Auction Discovery
- Generates trending auction listings from major houses (Sotheby's, Christie's, Phillips, Bonhams)
- Uses Gemini 2.0 Flash with **structured JSON schema responses** for reliable data parsing
- Displays estimated valuations, origin houses, and active lot badges
- "Engage War Room" action — pre-populates War Room with selected auction data
- Falls back to curated static listings when no API key is configured
- "Scan Networks" button triggers on-demand refresh

### 🧠 Agent Intel — AI Bidder Profiles
- **5 distinct AI bidder personalities** with unique strategies:
  - *Venture Victor* — Aggressive Growth (risk: 10%)
  - *Cautious Clara* — Conservative Investor (risk: 90%)
  - *Mathematical Max* — Rational Optimizer (risk: 50%)
  - *Speculative Sam* — Wildcard Gambler (risk: 30%)
  - *Hedge Fund Harry* — Deep Pockets (risk: 20%)
- **Behavioral Scatter Analysis** — interactive scatter plot mapping risk tolerance vs. base valuation
- Profile cards with personality descriptions, base values, and risk tolerances

### 📐 Theory Lab — Game Theory Visualizations
- **Nash Equilibrium** — interactive line chart showing strategy convergence with stochastic offsets for Winner's Curse
- **Vickrey Logic** — bar chart comparing English (72%) vs. Vickrey (100%) truth revelation rates
- Educational theory cards explaining second-price sealed-bid mechanics and strategy-proofness

### 📊 History — Operations Activity Log
- **Tabbed interface** with three sub-views: Simulations, Bids, and Auctions
- **Aggregate statistics**: total simulations, average win rate, best win rate, total bids placed, auctions created
- **Simulations table** — asset name, market value, win rate (color-coded), average price, verdict badge, timestamp
- **Bids table** — auction name, bid amount, auction status, timestamp
- **Auctions table** — auction name, house, market value, type, status, creation date
- Authentication-gated with animated empty states and loading skeletons

### 👤 Dashboard — Operator HQ
- Personalized greeting with username
- Metric cards: total simulations, average win rate, best win rate, member since date
- Recent simulation history with win rates and recommendation verdicts (Strong Buy / Caution / Avoid)
- Loading skeleton states for async data

### 🔐 Authentication System
- **Registration** with email + username + password validation (min 6 chars password, min 3 chars username)
- **Login** with email/password and JWT token issuance
- **JWT tokens** for stateless authentication with user context (`userId`, `email`, `username`)
- **bcrypt** password hashing with 12 salt rounds
- Dedicated auth rate limiting (15 attempts per 15 minutes)

### 🔌 Real-Time WebSocket
- Authenticated WebSocket connections via query parameter token
- Anonymous connections supported (read-only)
- **Broadcast events**: new bids, auction status changes (created/closed)
- Connected client count exposed via health endpoint
- Auto-cleanup on disconnect with error handling

### 🏗️ Auction Management
- **Create auctions** (authenticated) — name, description, market value, type (English/Vickrey), house, URL
- **Place bids** (authenticated) — validated against current highest bid
- **Close auctions** (creator-only) — with real-time broadcast notifications
- **List/filter** — all auctions or active-only with pagination
- **Detailed view** — auction info with full bid history and highest bid tracking

### 🛡️ Security & Rate Limiting
- **Helmet** headers (CSP disabled for SPA compatibility)
- **CORS** — wildcard in dev, restricted origin in production
- **Multi-tier rate limiting**:
  - General: 100 requests / 15 minutes
  - AI endpoints: 10 requests / minute (Gemini cost protection)
  - Auth endpoints: 15 attempts / 15 minutes (brute-force protection)
- **API key isolation** — Gemini key never exposed to client; all AI calls proxied through server
- **Request body limit** — 1MB max JSON payload
- **Centralized error handler** middleware

### 💾 Database
- **PostgreSQL** with connection pooling (max 10 connections, 30s idle timeout, 5s connect timeout)
- **SSL** in production (with relaxed certificate validation for managed services)
- **4 tables**: `users`, `auctions`, `bids`, `simulation_results`
- **Indexed** queries: bids by auction, bids by user, auctions by status, simulations by user
- **SQL migration system** — auto-runs on startup from ordered `.sql` files
- Graceful shutdown with pool cleanup

### 🎨 Design System
- **Premium dark-mode terminal UI** with glassmorphism effects
- Custom CSS design system with CSS custom properties (colors, spacing, typography, radii, shadows)
- **Animations**: `slide-up`, `scale-in`, `fade-in`, `slide-in-left`, `spin`, `spin-slow`, `bounce`, `pulse`
- Emerald/blue/rose/amber/purple color palette with glow effects
- Mono + sans-serif font pairing for data-rich interfaces
- Responsive grid layouts with media query breakpoints (768px, 1024px, 1280px)
- Interactive hover effects: border color transitions, lift transforms
- Reusable component library: `MetricCard`, `RiskItem`, `TheoryCard`, `Header`, `Footer`

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** 9+
- **PostgreSQL** 15+ (local or managed service like Neon, Supabase, Render)

### 1. Clone & Configure

```bash
git clone https://github.com/musabtahirhub/LIVEBID.PRO.git
cd LIVEBID.PRO
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Gemini AI (get key at https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Auth
JWT_SECRET=change_me_to_a_strong_random_secret

# Server
PORT=3001
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/livebid
```

### 2. Install Dependencies

```bash
npm install
```

> Uses npm Workspaces — installs both `client/` and `server/` dependencies automatically.

### 3. Run Development

```bash
npm run dev
```

This starts both services concurrently:
- **Client**: http://localhost:5173 (Vite dev server with HMR)
- **Server**: http://localhost:3001 (Express with tsx hot-reload)

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Docker Deployment

```bash
docker-compose up --build -d
```

Multi-stage Dockerfile:
1. **Stage 1** — Build client (Vite → static assets)
2. **Stage 2** — Build server (TypeScript → JavaScript)
3. **Stage 3** — Production image (Node 20 Alpine, production deps only)

### 6. Cloud Deployment

| Service   | Platform | Configuration                                              |
|-----------|----------|-------------------------------------------------------------|
| Frontend  | Vercel   | Auto-deploys from `/client`, API rewrites to Render backend |
| Backend   | Render   | Node.js service running `server/dist/index.js`              |
| Database  | Managed  | Any PostgreSQL provider (Neon, Supabase, Render, etc.)      |

---

## API Reference

### Authentication

| Method | Endpoint               | Auth     | Description                          |
|--------|------------------------|----------|--------------------------------------|
| POST   | `/api/auth/register`   | No       | Create account (email, username, password) |
| POST   | `/api/auth/login`      | No       | Authenticate and receive JWT token   |
| GET    | `/api/auth/me`         | Required | Get current user profile + simulation stats |

### Simulations

| Method | Endpoint               | Auth     | Description                          |
|--------|------------------------|----------|--------------------------------------|
| POST   | `/api/simulate`        | Optional | Run Monte Carlo simulation (up to 5,000 iterations) |
| GET    | `/api/simulate/history`| Optional | Get simulation history + stats (auth: persisted) |

### AI Intelligence

| Method | Endpoint               | Auth     | Description                          |
|--------|------------------------|----------|--------------------------------------|
| POST   | `/api/ai/feed`         | Optional | AI-generated trending auction listings (rate: 10/min) |
| POST   | `/api/ai/strategy`     | Optional | AI bidding strategy analysis (rate: 10/min) |

### Auctions

| Method | Endpoint                   | Auth     | Description                          |
|--------|----------------------------|----------|--------------------------------------|
| GET    | `/api/auctions`            | Optional | List auctions (filter: `?status=active`) |
| GET    | `/api/auctions/:id`        | Optional | Auction detail with bid history      |
| POST   | `/api/auctions`            | Required | Create new auction                   |
| POST   | `/api/auctions/:id/bid`    | Required | Place bid (must exceed current highest) |
| PATCH  | `/api/auctions/:id/close`  | Required | Close auction (creator only)         |

### History & Health

| Method | Endpoint               | Auth     | Description                          |
|--------|------------------------|----------|--------------------------------------|
| GET    | `/api/history`         | Required | Complete user activity (sims, bids, auctions) |
| GET    | `/api/health`          | No       | Server status, version, uptime, WS client count |

### WebSocket

| URL              | Auth     | Description                          |
|------------------|----------|--------------------------------------|
| `ws://host/ws`   | Optional | Real-time bid & auction updates (token via `?token=`) |

**WebSocket Events:**
- `connected` — Welcome message on connection
- `new_bid` — Broadcast when a bid is placed (auctionId, userId, username, amount)
- `auction_update` — Broadcast when auction status changes (auctionId, status)

---

## Project Structure

```
LIVEBID.PRO/
├── client/                         # React SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/              # MetricCard, RiskItem, TheoryCard
│   │   │   └── layout/            # Header, Footer
│   │   ├── context/               # AuthContext, AuctionContext
│   │   ├── pages/                 # WarRoom, GlobalFeed, AgentIntel, TheoryLab, History, Dashboard, Login, Register
│   │   ├── services/              # API client (fetch wrapper)
│   │   ├── styles/                # index.css (18KB design system)
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── App.tsx                # Router & layout orchestration
│   │   └── main.tsx               # Entry point
│   ├── vite.config.ts
│   └── package.json
│
├── server/                         # Express.js API
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts        # PostgreSQL pool & migration runner
│   │   │   ├── migrations/        # SQL schema files (auto-run on boot)
│   │   │   └── models/            # User, Auction, SimulationResult
│   │   ├── middleware/            # auth, errorHandler, rateLimit
│   │   ├── routes/                # auth, auctions, simulation, ai, history
│   │   ├── services/              # auctionEngine, geminiService, wsService
│   │   ├── utils/                 # JWT helpers
│   │   └── index.ts               # Server entry point
│   └── package.json
│
├── services/                       # Shared service utilities
│   ├── auctionEngine.ts
│   └── geminiService.ts
│
├── Dockerfile                      # Multi-stage production build
├── docker-compose.yml              # Container orchestration
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment variable template
└── package.json                    # Workspace root (npm Workspaces)
```

---

## Auction Engine

The simulation engine implements two auction mechanisms:

### English Auction (Ascending Price)
- Progressive ascending bids with configurable step size (1% of market value)
- Winner pays slightly above second-highest valuation
- Efficiency calculated as final price / highest valuation

### Vickrey Auction (Second-Price Sealed-Bid)
- Sealed bids with stochastic strategy errors based on risk aversion
- Winner pays second-highest bid (incentivizes truthful bidding)
- Strategy-proofness: dominant strategy is to reveal true preferences

### Monte Carlo Analysis
- Configurable 1–5,000 iterations with 1–5 competitor nodes
- Generates convergence data (first 100 rounds plotted)
- Profitability frontier at 50%–150% of market value
- Automated recommendation: **Strong Buy** (>70% win rate, <90% ceiling) / **Caution** / **Avoid** (<20% win rate)

---

## Educational Concepts

| Concept              | Description                                                                              |
|----------------------|------------------------------------------------------------------------------------------|
| **Vickrey Auction**  | Second-price sealed-bid mechanism. Highest bidder wins but pays the second-highest price. |
| **English Auction**  | Progressive ascending bids until no further offers. Most common auction format.           |
| **Nash Equilibrium** | Strategy profile where no player benefits from unilaterally changing their strategy.      |
| **Winner's Curse**   | Risk of overpaying when the winner is the bidder who most overestimates value.            |
| **Strategy-Proofness** | Mechanism design where truthful bidding is the dominant strategy.                       |
| **Monte Carlo**      | Repeated random sampling to approximate probability distributions and expected outcomes.  |

---

## Environment Variables

| Variable         | Required | Description                                    | Default               |
|------------------|----------|------------------------------------------------|-----------------------|
| `GEMINI_API_KEY` | No*      | Google Gemini API key for AI features           | Falls back to static data |
| `JWT_SECRET`     | Yes      | Secret for signing JWT tokens                   | —                     |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string                    | —                     |
| `PORT`           | No       | Server port                                     | `3001`                |
| `NODE_ENV`       | No       | Environment (`development` / `production`)      | `development`         |
| `CLIENT_URL`     | No       | Allowed CORS origin in production               | `http://localhost:5173` |

> \* Without `GEMINI_API_KEY`, the platform uses curated fallback data for the Global Feed and generates template-based strategy reports.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
