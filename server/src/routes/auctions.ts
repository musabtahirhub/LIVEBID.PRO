import { Router, Request, Response } from 'express';
import { AuctionModel } from '../db/models/Auction.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { broadcastBid, broadcastAuctionUpdate } from '../services/wsService.js';

const router = Router();

/**
 * GET /api/auctions
 * List auctions with optional status filter
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    let auctions;
    if (status === 'active') {
      auctions = await AuctionModel.findActive();
    } else {
      auctions = await AuctionModel.findAll(Number(limit), Number(offset));
    }

    res.json({ auctions, total: auctions.length });
  } catch (error) {
    console.error('[AUCTION] List error:', error);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

/**
 * GET /api/auctions/:id
 * Get auction details with bids
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const auction = await AuctionModel.findById(Number(req.params.id));
    if (!auction) {
      res.status(404).json({ error: 'Auction not found' });
      return;
    }

    const bids = await AuctionModel.getBids(auction.id);
    const highestBid = await AuctionModel.getHighestBid(auction.id);

    res.json({
      auction,
      bids,
      highestBid: highestBid?.amount || 0,
      bidCount: bids.length,
    });
  } catch (error) {
    console.error('[AUCTION] Detail error:', error);
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

/**
 * POST /api/auctions
 * Create a new auction (authenticated)
 */
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, market_value, auction_type, house, url } = req.body;

    if (!name || !market_value) {
      res.status(400).json({ error: 'Name and market_value are required' });
      return;
    }

    const auction = await AuctionModel.create({
      name,
      description,
      market_value: Number(market_value),
      auction_type: auction_type || 'ENGLISH',
      house,
      url,
      creator_id: req.user!.userId,
    });

    broadcastAuctionUpdate(auction.id, 'created');

    res.status(201).json({ auction });
  } catch (error) {
    console.error('[AUCTION] Create error:', error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

/**
 * POST /api/auctions/:id/bid
 * Place a bid on an auction (authenticated)
 */
router.post('/:id/bid', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionId = Number(req.params.id);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Valid bid amount is required' });
      return;
    }

    const auction = await AuctionModel.findById(auctionId);
    if (!auction) {
      res.status(404).json({ error: 'Auction not found' });
      return;
    }

    if (auction.status !== 'active') {
      res.status(400).json({ error: 'Auction is not active' });
      return;
    }

    // Check bid is higher than current highest
    const highestBid = await AuctionModel.getHighestBid(auctionId);
    if (highestBid && amount <= highestBid.amount) {
      res.status(400).json({
        error: `Bid must be higher than current highest: $${highestBid.amount}`,
      });
      return;
    }

    const bid = await AuctionModel.placeBid(auctionId, req.user!.userId, Number(amount));

    // Broadcast to all connected clients
    broadcastBid(auctionId, req.user!.userId, req.user!.username, Number(amount));

    res.status(201).json({ bid });
  } catch (error) {
    console.error('[AUCTION] Bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

/**
 * PATCH /api/auctions/:id/close
 * Close an auction (creator only)
 */
router.patch('/:id/close', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const auction = await AuctionModel.findById(Number(req.params.id));
    if (!auction) {
      res.status(404).json({ error: 'Auction not found' });
      return;
    }

    if (auction.creator_id !== req.user!.userId) {
      res.status(403).json({ error: 'Only the creator can close this auction' });
      return;
    }

    await AuctionModel.updateStatus(auction.id, 'closed');
    broadcastAuctionUpdate(auction.id, 'closed');

    res.json({ message: 'Auction closed', auctionId: auction.id });
  } catch (error) {
    console.error('[AUCTION] Close error:', error);
    res.status(500).json({ error: 'Failed to close auction' });
  }
});

export default router;
