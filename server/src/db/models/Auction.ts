import { getPool } from '../database.js';

export interface Auction {
  id: number;
  name: string;
  description: string | null;
  market_value: number;
  auction_type: string;
  status: string;
  house: string | null;
  url: string | null;
  creator_id: number | null;
  created_at: string;
  closed_at: string | null;
}

export interface Bid {
  id: number;
  auction_id: number;
  user_id: number;
  amount: number;
  created_at: string;
}

export interface UserBidWithAuction extends Bid {
  auction_name: string;
  auction_status: string;
}

export const AuctionModel = {
  async findAll(limit = 50, offset = 0): Promise<Auction[]> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM auctions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows as Auction[];
  },

  async findActive(): Promise<Auction[]> {
    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM auctions WHERE status = 'active' ORDER BY created_at DESC"
    );
    return result.rows as Auction[];
  },

  async findById(id: number): Promise<Auction | undefined> {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    return result.rows[0] as Auction | undefined;
  },

  async findByUser(userId: number, limit = 50): Promise<Auction[]> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM auctions WHERE creator_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows as Auction[];
  },

  async create(data: {
    name: string;
    description?: string;
    market_value: number;
    auction_type?: string;
    house?: string;
    url?: string;
    creator_id?: number;
  }): Promise<Auction> {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO auctions (name, description, market_value, auction_type, house, url, creator_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.name,
        data.description || null,
        data.market_value,
        data.auction_type || 'ENGLISH',
        data.house || null,
        data.url || null,
        data.creator_id || null,
      ]
    );
    return result.rows[0] as Auction;
  },

  async updateStatus(id: number, status: string): Promise<void> {
    const pool = getPool();
    await pool.query(
      'UPDATE auctions SET status = $1, closed_at = NOW() WHERE id = $2',
      [status, id]
    );
  },

  async getBids(auctionId: number): Promise<Bid[]> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM bids WHERE auction_id = $1 ORDER BY amount DESC',
      [auctionId]
    );
    return result.rows as Bid[];
  },

  async getHighestBid(auctionId: number): Promise<Bid | undefined> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM bids WHERE auction_id = $1 ORDER BY amount DESC LIMIT 1',
      [auctionId]
    );
    return result.rows[0] as Bid | undefined;
  },

  async placeBid(auctionId: number, userId: number, amount: number): Promise<Bid> {
    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO bids (auction_id, user_id, amount) VALUES ($1, $2, $3) RETURNING *',
      [auctionId, userId, amount]
    );
    return result.rows[0] as Bid;
  },

  async getBidsByUser(userId: number, limit = 50): Promise<UserBidWithAuction[]> {
    const pool = getPool();
    const result = await pool.query(
      `SELECT b.*, a.name as auction_name, a.status as auction_status
       FROM bids b
       JOIN auctions a ON b.auction_id = a.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows as UserBidWithAuction[];
  },
};
