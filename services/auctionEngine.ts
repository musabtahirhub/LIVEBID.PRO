
import { AuctionType, Bidder, AuctionResult } from '../types';

export interface DetailedAuctionResult extends AuctionResult {
  allBids: { bidderId: string; bid: number }[];
}

/**
 * Simulates a single auction round with detailed bid tracking.
 */
export const runAuction = (
  type: AuctionType,
  bidders: Bidder[],
  itemBaseValue: number
): DetailedAuctionResult => {
  // Generate private valuations for this specific round
  const currentValuations = bidders.map(b => ({
    id: b.id,
    name: b.name,
    valuation: b.trueValueBase + (Math.random() - 0.5) * (itemBaseValue * 0.2),
    riskAversion: b.riskAversion
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
      bid: Math.min(v.valuation, finalPrice)
    }));

    return {
      winnerId: highestValuation.id,
      winningBid: highestValuation.valuation,
      finalPrice: finalPrice,
      secondHighestBid: secondHighestValuation.valuation,
      totalBids: Math.floor(finalPrice / step),
      efficiency: finalPrice / highestValuation.valuation,
      type: AuctionType.ENGLISH,
      allBids
    };
  } else {
    // VICKREY
    const bids = currentValuations.map(v => {
      const strategyError = (Math.random() - 0.5) * (v.riskAversion * (itemBaseValue * 0.05));
      return {
        id: v.id,
        bidAmount: v.valuation + strategyError
      };
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
      allBids
    };
  }
};
