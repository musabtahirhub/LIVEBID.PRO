export enum AuctionType {
  ENGLISH = 'ENGLISH',
  VICKREY = 'VICKREY',
}

export interface Bidder {
  id: string;
  name: string;
  personality: string;
  description: string;
  trueValueBase: number;
  riskAversion: number;
}

export interface BiddingStrategy {
  shouldBid: boolean;
  initialBid: number;
  stopPrice: number;
  winProbability: number;
  expectedProfit: number;
  rationale: string;
}

export interface AuctionResult {
  winnerId: string;
  winningBid: number;
  finalPrice: number;
  secondHighestBid: number;
  totalBids: number;
  efficiency: number;
  type: AuctionType;
}

export interface RealAuction {
  name: string;
  estimatedValue: number;
  house: string;
  url: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SimulationRequest {
  itemName: string;
  marketValue: number;
  personalValue: number;
  competition: number;
  iterations?: number;
}

export interface SimulationResponse {
  simData: { round: number; price: number; userWon: boolean }[];
  profitData: { label: string; margin: number; risk: number }[];
  winRate: number;
  avgWinPrice: number;
  maxCompetitorBid: number;
  recommendation: { status: string; color: string; score: number };
  sentimentData: { name: string; value: number; color: string }[];
  bidders: Bidder[];
}

export interface StrategyResponse {
  text: string;
  sources: any[];
  structured: { openingBid: number; timing: string };
}

export interface AuctionFeedResponse {
  auctions: RealAuction[];
  sources: any[];
}

// ─── History Types ─────────────────────────────────────────────

export interface SimulationHistoryItem {
  id: number;
  auction_name: string;
  market_value: number;
  personal_value: number;
  competition: number;
  iterations: number;
  win_rate: number;
  avg_win_price: number;
  max_competitor_bid: number | null;
  recommendation: string;
  created_at: string;
}

export interface UserBidItem {
  id: number;
  auction_id: number;
  amount: number;
  auction_name: string;
  auction_status: string;
  created_at: string;
}

export interface UserAuctionItem {
  id: number;
  name: string;
  description: string | null;
  market_value: number;
  auction_type: string;
  status: string;
  house: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface HistoryStats {
  totalSimulations: number;
  avgWinRate: number;
  bestWinRate: number;
  totalBids: number;
  totalAuctions: number;
}

export interface HistoryResponse {
  simulations: SimulationHistoryItem[];
  bids: UserBidItem[];
  auctions: UserAuctionItem[];
  stats: HistoryStats;
}

export type Tab = 'WAR_ROOM' | 'GLOBAL_FEED' | 'AGENT_INTEL' | 'THEORY_LAB' | 'HISTORY';
