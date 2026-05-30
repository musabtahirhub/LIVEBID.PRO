import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool: pg.Pool;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('[DB] Unexpected pool error:', err);
    });
  }

  return pool;
}

export async function initDb(): Promise<void> {
  const p = getPool();

  // Test connection
  try {
    const result = await p.query('SELECT NOW()');
    console.log(`[DB] Connected to PostgreSQL at ${result.rows[0].now}`);
  } catch (err) {
    console.error('[DB] Failed to connect:', err);
    throw err;
  }

  // Run migrations
  await runMigrations(p);
}

async function runMigrations(p: pg.Pool): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.warn('[DB] No migrations directory found');
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`[DB] Running migration: ${file}`);
    await p.query(sql);
  }

  console.log(`[DB] ${migrationFiles.length} migration(s) applied`);
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log('[DB] Connection pool closed');
  }
}
