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

export interface AuctionResult {
  winnerId: string;
  winningBid: number;
  finalPrice: number;
  secondHighestBid: number;
  totalBids: number;
  efficiency: number;
  type: AuctionType;
}

export interface DetailedAuctionResult extends AuctionResult {
  allBids: { bidderId: string; bid: number }[];
}

export const INITIAL_BIDDERS: Bidder[] = [
  {
    id: '1', name: 'Venture Victor', personality: 'Aggressive Growth',
    description: 'Bids high and fast, looking for dominance at any cost.',
    trueValueBase: 1200, riskAversion: 0.1,
  },
  {
    id: '2', name: 'Cautious Clara', personality: 'Conservative Investor',
    description: 'Strictly adheres to budget. Rarely overbids.',
    trueValueBase: 950, riskAversion: 0.9,
  },
  {
    id: '3', name: 'Mathematical Max', personality: 'Rational Optimizer',
    description: 'Attempts to find the Nash Equilibrium in every round.',
    trueValueBase: 1100, riskAversion: 0.5,
  },
  {
    id: '4', name: 'Speculative Sam', personality: 'Wildcard Gambler',
    description: 'Value fluctuates wildly. Prone to irrational bidding.',
    trueValueBase: 1050, riskAversion: 0.3,
  },
  {
    id: '5', name: 'Hedge Fund Harry', personality: 'Deep Pockets',
    description: 'Aims to price out competitors through sheer volume.',
    trueValueBase: 1300, riskAversion: 0.2,
  },
];

/**
 * Simulates a single auction round with detailed bid tracking.
 */
export function runAuction(
  type: AuctionType,
  bidders: Bidder[],
  itemBaseValue: number
): DetailedAuctionResult {
  const currentValuations = bidders.map(b => ({
    id: b.id,
    name: b.name,
    valuation: b.trueValueBase + (Math.random() - 0.5) * (itemBaseValue * 0.2),
    riskAversion: b.riskAversion,
  }));

  const sortedByValuation = [...currentValuations].sort((a, b) => b.valuation - a.valuation);
  const highestValuation = sortedByValuation[0];
  const secondHighestValuation = sortedByValuation[1];

  let allBids: { bidderId: string; bid: number }[] = [];

  if (type === AuctionType.ENGLISH) {
    const step = itemBaseValue * 0.01;
    const finalPrice = Math.min(highestValuation.valuation, secondHighestValuation.valuation + step);

    allBids = currentValuations.map(v => ({
      bidderId: v.id,
      bid: Math.min(v.valuation, finalPrice),
    }));

    return {
      winnerId: highestValuation.id,
      winningBid: highestValuation.valuation,
      finalPrice,
      secondHighestBid: secondHighestValuation.valuation,
      totalBids: Math.floor(finalPrice / step),
      efficiency: finalPrice / highestValuation.valuation,
      type: AuctionType.ENGLISH,
      allBids,
    };
  } else {
    // VICKREY
    const bids = currentValuations.map(v => {
      const strategyError = (Math.random() - 0.5) * (v.riskAversion * (itemBaseValue * 0.05));
      return { id: v.id, bidAmount: v.valuation + strategyError };
    });

    const sortedBids = [...bids].sort((a, b) => b.bidAmount - a.bidAmount);
    const winner = sortedBids[0];
    const secondPrice = sortedBids[1].bidAmount;

    allBids = bids.map(b => ({ bidderId: b.id, bid: b.bidAmount }));

    return {
      winnerId: winner.id,
      winningBid: winner.bidAmount,
      finalPrice: secondPrice,
      secondHighestBid: secondPrice,
      totalBids: bidders.length,
      efficiency: secondPrice / highestValuation.valuation,
      type: AuctionType.VICKREY,
      allBids,
    };
  }
}

/**
 * Run a full Monte Carlo simulation.
 */
export function runMonteCarloSimulation(
  iterations: number,
  competitorCount: number,
  marketValue: number,
  personalValue: number
): {
  simData: { round: number; price: number; userWon: boolean }[];
  profitData: { label: string; margin: number; risk: number }[];
  winRate: number;
  avgWinPrice: number;
  maxCompetitorBid: number;
  recommendation: { status: string; color: string; score: number };
  sentimentData: { name: string; value: number; color: string }[];
} {
  const activeBidders = INITIAL_BIDDERS.slice(0, competitorCount + 1);
  const results: { round: number; price: number; userWon: boolean }[] = [];
  let wins = 0;
  let totalWinPrice = 0;
  let maxComp = 0;

  for (let i = 0; i < iterations; i++) {
    const res = runAuction(AuctionType.ENGLISH, activeBidders, marketValue);
    const userWon = personalValue > res.finalPrice;
    if (userWon) {
      wins++;
      totalWinPrice += res.finalPrice;
    }
    maxComp = Math.max(maxComp, res.finalPrice);
    results.push({ round: i, price: res.finalPrice, userWon });
  }

  // Profitability Frontier
  const profitData = [];
  for (let p = 0.5; p <= 1.5; p += 0.1) {
    const testPrice = marketValue * p;
    const profit = personalValue - testPrice;
    profitData.push({
      label: `${(p * 100).toFixed(0)}%`,
      margin: profit > 0 ? profit : 0,
      risk: testPrice > marketValue ? testPrice - marketValue : 0,
    });
  }

  const winRate = wins / iterations;
  const avgWinPrice = wins > 0 ? totalWinPrice / wins : 0;
  const score = Math.round(winRate * 100);

  let status = 'Caution';
  let color = 'amber';
  if (winRate > 0.7 && avgWinPrice < personalValue * 0.9) {
    status = 'Strong Buy';
    color = 'emerald';
  } else if (winRate < 0.2 || avgWinPrice > personalValue) {
    status = 'Avoid';
    color = 'rose';
  }

  // Sentiment
  const agg = activeBidders.filter(b => b.riskAversion < 0.4).length;
  const cons = activeBidders.length - agg;

  return {
    simData: results.slice(0, 100),
    profitData,
    winRate,
    avgWinPrice,
    maxCompetitorBid: maxComp,
    recommendation: { status, color, score },
    sentimentData: [
      { name: 'Aggressive', value: agg, color: '#f43f5e' },
      { name: 'Conservative', value: cons, color: '#3b82f6' },
    ],
  };
}
