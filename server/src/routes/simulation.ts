import { Router, Request, Response } from 'express';
import { runMonteCarloSimulation, INITIAL_BIDDERS } from '../services/auctionEngine.js';
import { optionalAuth } from '../middleware/auth.js';
import { SimulationModel } from '../db/models/SimulationResult.js';

const router = Router();

/**
 * POST /api/simulate
 * Run a Monte Carlo auction simulation
 */
router.post('/', optionalAuth, (req: Request, res: Response): void => {
  try {
    const {
      itemName = 'Unknown Asset',
      marketValue = 1500,
      personalValue = 1800,
      competition = 3,
      iterations = 250,
    } = req.body;

    // Validate
    if (iterations > 5000) {
      res.status(400).json({ error: 'Maximum 5000 iterations allowed' });
      return;
    }

    if (competition < 1 || competition > 5) {
      res.status(400).json({ error: 'Competition must be between 1 and 5' });
      return;
    }

    // Run simulation
    const result = runMonteCarloSimulation(
      Number(iterations),
      Number(competition),
      Number(marketValue),
      Number(personalValue)
    );

    // Persist if authenticated
    if (req.user) {
      SimulationModel.create({
        user_id: req.user.userId,
        auction_name: itemName,
        market_value: Number(marketValue),
        personal_value: Number(personalValue),
        competition: Number(competition),
        iterations: Number(iterations),
        win_rate: result.winRate,
        avg_win_price: result.avgWinPrice,
        max_competitor_bid: result.maxCompetitorBid,
        recommendation: result.recommendation.status,
      });
    }

    res.json({
      ...result,
      bidders: INITIAL_BIDDERS.slice(0, Number(competition) + 1),
    });
  } catch (error) {
    console.error('[SIM] Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

/**
 * GET /api/simulate/history
 * Get simulation history for authenticated user
 */
router.get('/history', optionalAuth, (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.json({ history: [], message: 'Login to save simulation history' });
      return;
    }

    const history = SimulationModel.findByUser(req.user.userId);
    const stats = SimulationModel.getStats(req.user.userId);

    res.json({ history, stats });
  } catch (error) {
    console.error('[SIM] History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
