import { getDb } from '../database.js';

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
  findByEmail(email: string): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  },

  findByUsername(username: string): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  },

  findById(id: number): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  },

  create(email: string, username: string, passwordHash: string): User {
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)'
    ).run(email, username, passwordHash);

    return this.findById(Number(result.lastInsertRowid))!;
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
