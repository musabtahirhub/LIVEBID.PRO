import { Router, Request, Response } from 'express';
import { getTrendingAuctions, getBiddingStrategy } from '../services/geminiService.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/ai/feed
 * Get AI-generated trending auction listings
 */
router.post('/feed', aiLimiter, optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getTrendingAuctions();
    res.json(result);
  } catch (error) {
    console.error('[AI] Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch AI feed' });
  }
});

/**
 * POST /api/ai/strategy
 * Get AI-powered bidding strategy analysis
 */
router.post('/strategy', aiLimiter, optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      itemName,
      marketValue,
      personalValue,
      competitionLevel,
      simResults,
    } = req.body;

    if (!itemName || !marketValue || !personalValue) {
      res.status(400).json({ error: 'itemName, marketValue, and personalValue are required' });
      return;
    }

    const result = await getBiddingStrategy(
      itemName,
      Number(marketValue),
      Number(personalValue),
      competitionLevel || 'Moderate',
      simResults || { avgWinPrice: 0, winRate: 0, maxCompetitorBid: 0 }
    );

    res.json(result);
  } catch (error) {
    console.error('[AI] Strategy error:', error);
    res.status(500).json({ error: 'Failed to generate strategy' });
  }
});

export default router;
