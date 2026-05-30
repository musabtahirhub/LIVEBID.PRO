-- LiveBid.Pro Initial Schema (PostgreSQL)
-- Users, Auctions, Bids, Simulation Results

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auctions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  market_value DOUBLE PRECISION NOT NULL,
  auction_type TEXT NOT NULL DEFAULT 'ENGLISH',
  status TEXT NOT NULL DEFAULT 'active',
  house TEXT,
  url TEXT,
  creator_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulation_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  auction_name TEXT NOT NULL,
  market_value DOUBLE PRECISION NOT NULL,
  personal_value DOUBLE PRECISION NOT NULL,
  competition INTEGER NOT NULL,
  iterations INTEGER NOT NULL,
  win_rate DOUBLE PRECISION NOT NULL,
  avg_win_price DOUBLE PRECISION NOT NULL,
  max_competitor_bid DOUBLE PRECISION,
  recommendation TEXT NOT NULL,
  strategy_report TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_user ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_simulations_user ON simulation_results(user_id);
