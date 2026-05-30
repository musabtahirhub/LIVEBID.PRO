# ── Stage 1: Build Client ─────────────────────────────────────
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ── Stage 2: Build Server ─────────────────────────────────────
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npx tsc

# ── Stage 3: Production ──────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Copy server
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev
COPY --from=server-build /app/server/dist ./server/dist
COPY server/src/db/migrations ./server/dist/db/migrations

# Copy client build
COPY --from=client-build /app/client/dist ./client/dist

# Create data directory
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/livebid.db

EXPOSE 3001

CMD ["node", "server/dist/index.js"]
