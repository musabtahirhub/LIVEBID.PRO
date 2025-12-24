
export enum AuctionType {
  ENGLISH = 'ENGLISH',
  VICKREY = 'VICKREY'
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
