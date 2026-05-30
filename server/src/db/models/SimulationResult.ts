import { getDb } from '../database.js';

export interface SimulationResult {
  id: number;
  user_id: number | null;
  auction_name: string;
  market_value: number;
  personal_value: number;
  competition: number;
  iterations: number;
  win_rate: number;
  avg_win_price: number;
  max_competitor_bid: number | null;
  recommendation: string;
  strategy_report: string | null;
  created_at: string;
}

export const SimulationModel = {
  findByUser(userId: number, limit = 20): SimulationResult[] {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM simulation_results WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
    ).all(userId, limit) as SimulationResult[];
  },

  findById(id: number): SimulationResult | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM simulation_results WHERE id = ?')
      .get(id) as SimulationResult | undefined;
  },

  create(data: {
    user_id?: number;
    auction_name: string;
    market_value: number;
    personal_value: number;
    competition: number;
    iterations: number;
    win_rate: number;
    avg_win_price: number;
    max_competitor_bid?: number;
    recommendation: string;
    strategy_report?: string;
  }): SimulationResult {
    const db = getDb();
    const result = db.prepare(
      `INSERT INTO simulation_results 
       (user_id, auction_name, market_value, personal_value, competition, iterations, win_rate, avg_win_price, max_competitor_bid, recommendation, strategy_report)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      data.user_id || null,
      data.auction_name,
      data.market_value,
      data.personal_value,
      data.competition,
      data.iterations,
      data.win_rate,
      data.avg_win_price,
      data.max_competitor_bid || null,
      data.recommendation,
      data.strategy_report || null
    );

    return this.findById(Number(result.lastInsertRowid))!;
  },

  getStats(userId: number): { total: number; avgWinRate: number; bestWinRate: number } {
    const db = getDb();
    const row = db.prepare(
      `SELECT 
        COUNT(*) as total,
        AVG(win_rate) as avgWinRate,
        MAX(win_rate) as bestWinRate
       FROM simulation_results WHERE user_id = ?`
    ).get(userId) as any;

    return {
      total: row.total || 0,
      avgWinRate: row.avgWinRate || 0,
      bestWinRate: row.bestWinRate || 0,
    };
  },
};
