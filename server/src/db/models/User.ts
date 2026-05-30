import { getPool } from '../database.js';

export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] as User | undefined;
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] as User | undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] as User | undefined;
  },

  async create(email: string, username: string, passwordHash: string): Promise<User> {
    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [email, username, passwordHash]
    );
    return result.rows[0] as User;
  },

  toPublic(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      created_at: user.created_at,
    };
  },
};
