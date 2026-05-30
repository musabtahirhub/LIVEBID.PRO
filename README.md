# LiveBid.Pro — Full-Stack Auction Intelligence Platform

> AI-powered auction bidding platform with Monte Carlo simulations, real-time market intelligence, game theory analysis, and a secure backend.

## Architecture

```
┌─────────────────────────────────┐
│         React Frontend          │
│   (Vite + React Router + CSS)   │
│         Port 5173 (dev)         │
├─────────────────────────────────┤
│           /api proxy            │
├─────────────────────────────────┤
│       Express.js Backend        │
│  (REST API + WebSocket + JWT)   │
│         Port 3001               │
├─────────────────────────────────┤
│          SQLite (WAL)           │
│   Users, Auctions, Bids, Sims  │
└─────────────────────────────────┘
```

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, Vite, React Router, Recharts |
| Styling    | Vanilla CSS Design System             |
| Backend    | Node.js, Express, TypeScript          |
| Database   | SQLite via better-sqlite3             |
| Auth       | JWT + bcrypt                          |
| AI         | Google Gemini (server-side only)      |
| Real-time  | WebSocket (ws)                        |
| DevOps     | Docker, npm Workspaces                |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Configure

```bash
git clone https://github.com/your-repo/LIVEBID.PRO.git
cd LIVEBID.PRO
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and JWT_SECRET
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development

```bash
npm run dev
```

This starts both:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Docker Deployment

```bash
docker-compose up --build -d
```

## API Endpoints

| Method | Endpoint               | Auth     | Description                 |
|--------|------------------------|----------|-----------------------------|
| POST   | /api/auth/register     | No       | Create account              |
| POST   | /api/auth/login        | No       | Authenticate                |
| GET    | /api/auth/me           | Required | Get current user + stats    |
| POST   | /api/simulate          | Optional | Run Monte Carlo simulation  |
| GET    | /api/simulate/history  | Optional | Get simulation history      |
| POST   | /api/ai/feed           | Optional | AI-generated auction feed   |
| POST   | /api/ai/strategy       | Optional | AI bidding strategy         |
| GET    | /api/auctions          | Optional | List auctions               |
| POST   | /api/auctions          | Required | Create auction              |
| POST   | /api/auctions/:id/bid  | Required | Place bid (WebSocket broadcast) |
| GET    | /api/health            | No       | Server health check         |

## Features

- **War Room**: Monte Carlo simulation with convergence analysis and profitability frontier charts
- **Global Feed**: AI-powered auction discovery from Sotheby's, Christie's, Phillips
- **Agent Intel**: AI bidder profiles with behavioral scatter analysis
- **Theory Lab**: Interactive Nash Equilibrium and Vickrey auction visualizations
- **Dashboard**: Persistent simulation history and operator stats
- **Auth**: JWT registration/login with bcrypt password hashing
- **Real-time**: WebSocket broadcasts for live bid updates
- **Security**: Gemini API key server-side only, rate limiting, Helmet headers

## Educational Concepts

- **Vickrey Auction (Second-Price Sealed-Bid)**: Bidders submit bids without seeing others. Highest bidder wins but pays second-highest price.
- **English Auction**: Progressive ascending bids until no one offers more.
- **Nash Equilibrium**: No player benefits by unilaterally changing strategy.
- **Strategy-Proofness**: Dominant strategy is to reveal true preferences.

## License

This project is open-source and available for educational use.
