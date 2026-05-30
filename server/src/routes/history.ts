import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { SimulationModel } from '../db/models/SimulationResult.js';
import { AuctionModel } from '../db/models/Auction.js';

const router = Router();

/**
 * GET /api/history
 * Get complete user activity history (authenticated)
 */
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Fetch all data in parallel
    const [simulations, bids, auctions, simStats] = await Promise.all([
      SimulationModel.findByUser(userId, 50),
      AuctionModel.getBidsByUser(userId, 50),
      AuctionModel.findByUser(userId, 50),
      SimulationModel.getStats(userId),
    ]);

    res.json({
      simulations,
      bids,
      auctions,
      stats: {
        totalSimulations: simStats.total,
        avgWinRate: simStats.avgWinRate,
        bestWinRate: simStats.bestWinRate,
        totalBids: bids.length,
        totalAuctions: auctions.length,
      },
    });
  } catch (error) {
    console.error('[HISTORY] Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
