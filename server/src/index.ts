import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb, closeDb } from './db/database.js';
import { initWebSocket, getConnectedCount } from './services/wsService.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import auctionRoutes from './routes/auctions.js';
import simulationRoutes from './routes/simulation.js';
import aiRoutes from './routes/ai.js';
import historyRoutes from './routes/history.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─── Global Middleware ──────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL || 'http://localhost:5173'
    : '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/simulate', simulationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/history', historyRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'operational',
    version: '2.0.0',
    uptime: process.uptime(),
    wsClients: getConnectedCount(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve Client in Production ─────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── Error Handler (must be last) ───────────────────────────────
app.use(errorHandler);

// ─── Initialize Database & Start Server ─────────────────────────
async function start() {
  try {
    await initDb();
  } catch (err) {
    console.error('[SERVER] Failed to initialize database:', err);
    process.exit(1);
  }

  // ─── Initialize WebSocket ───────────────────────────────────
  initWebSocket(server);

  // ─── Start Server ──────────────────────────────────────────
  server.listen(PORT, () => {
    console.log('');
    console.log('  ⚡ LiveBid.Pro Server v2.0.0');
    console.log(`  📡 HTTP:  http://localhost:${PORT}`);
    console.log(`  🔌 WS:    ws://localhost:${PORT}/ws`);
    console.log(`  📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`  🌍 Env:   ${process.env.NODE_ENV || 'development'}`);
    console.log(`  🗄️  DB:    PostgreSQL (connected)`);
    console.log('');
  });
}

start();

// ─── Graceful Shutdown ──────────────────────────────────────────
process.on('SIGINT', async () => {
  console.log('\n[SERVER] Shutting down gracefully...');
  await closeDb();
  server.close(() => {
    console.log('[SERVER] Closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  await closeDb();
  server.close(() => process.exit(0));
});

export default app;
