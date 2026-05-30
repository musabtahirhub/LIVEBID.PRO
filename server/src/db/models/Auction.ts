import { getDb } from '../database.js';

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

export const AuctionModel = {
  findAll(limit = 50, offset = 0): Auction[] {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM auctions ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset) as Auction[];
  },

  findActive(): Auction[] {
    const db = getDb();
    return db.prepare(
      "SELECT * FROM auctions WHERE status = 'active' ORDER BY created_at DESC"
    ).all() as Auction[];
  },

  findById(id: number): Auction | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM auctions WHERE id = ?').get(id) as Auction | undefined;
  },

  create(data: {
    name: string;
    description?: string;
    market_value: number;
    auction_type?: string;
    house?: string;
    url?: string;
    creator_id?: number;
  }): Auction {
    const db = getDb();
    const result = db.prepare(
      `INSERT INTO auctions (name, description, market_value, auction_type, house, url, creator_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      data.name,
      data.description || null,
      data.market_value,
      data.auction_type || 'ENGLISH',
      data.house || null,
      data.url || null,
      data.creator_id || null
    );

    return this.findById(Number(result.lastInsertRowid))!;
  },

  updateStatus(id: number, status: string): void {
    const db = getDb();
    db.prepare('UPDATE auctions SET status = ?, closed_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, id);
  },

  getBids(auctionId: number): Bid[] {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC'
    ).all(auctionId) as Bid[];
  },

  getHighestBid(auctionId: number): Bid | undefined {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC LIMIT 1'
    ).get(auctionId) as Bid | undefined;
  },

  placeBid(auctionId: number, userId: number, amount: number): Bid {
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO bids (auction_id, user_id, amount) VALUES (?, ?, ?)'
    ).run(auctionId, userId, amount);

    return db.prepare('SELECT * FROM bids WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as Bid;
  },
};
