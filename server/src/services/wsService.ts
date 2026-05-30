import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { verifyToken } from '../utils/jwt.js';

interface WsClient {
  ws: WebSocket;
  userId?: number;
  username?: string;
}

let wss: WebSocketServer;
const clients: Set<WsClient> = new Set();

export function initWebSocket(server: Server): void {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const client: WsClient = { ws };

    // Try to authenticate from query param
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (token) {
      try {
        const payload = verifyToken(token);
        client.userId = payload.userId;
        client.username = payload.username;
      } catch {
        // Anonymous connection allowed
      }
    }

    clients.add(client);
    console.log(`[WS] Client connected (${client.username || 'anonymous'}). Total: ${clients.size}`);

    ws.on('close', () => {
      clients.delete(client);
      console.log(`[WS] Client disconnected. Total: ${clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('[WS] Error:', err);
      clients.delete(client);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'LiveBid.Pro WebSocket connected',
      timestamp: new Date().toISOString(),
    }));
  });

  console.log('[WS] WebSocket server initialized on /ws');
}

/**
 * Broadcast a message to all connected clients.
 */
export function broadcast(type: string, data: unknown): void {
  const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });

  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  }
}

/**
 * Notify about a new bid on an auction.
 */
export function broadcastBid(auctionId: number, userId: number, username: string, amount: number): void {
  broadcast('new_bid', {
    auctionId,
    userId,
    username,
    amount,
  });
}

/**
 * Notify when an auction status changes.
 */
export function broadcastAuctionUpdate(auctionId: number, status: string): void {
  broadcast('auction_update', { auctionId, status });
}

export function getConnectedCount(): number {
  return clients.size;
}
