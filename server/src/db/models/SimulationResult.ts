import { getPool } from '../database.js';

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
  async findByUser(userId: number, limit = 20): Promise<SimulationResult[]> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM simulation_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows as SimulationResult[];
  },

  async findById(id: number): Promise<SimulationResult | undefined> {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM simulation_results WHERE id = $1',
      [id]
    );
    return result.rows[0] as SimulationResult | undefined;
  },

  async create(data: {
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
  }): Promise<SimulationResult> {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO simulation_results
       (user_id, auction_name, market_value, personal_value, competition, iterations, win_rate, avg_win_price, max_competitor_bid, recommendation, strategy_report)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
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
        data.strategy_report || null,
      ]
    );
    return result.rows[0] as SimulationResult;
  },

  async getStats(userId: number): Promise<{ total: number; avgWinRate: number; bestWinRate: number }> {
    const pool = getPool();
    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        AVG(win_rate) as "avgWinRate",
        MAX(win_rate) as "bestWinRate"
       FROM simulation_results WHERE user_id = $1`,
      [userId]
    );

    const row = result.rows[0];
    return {
      total: parseInt(row.total) || 0,
      avgWinRate: parseFloat(row.avgWinRate) || 0,
      bestWinRate: parseFloat(row.bestWinRate) || 0,
    };
  },
};
