/**
 * Production server entry for the Hono + tRPC backend.
 *
 * Run locally with: bun run backend/server.ts
 * Fly.io invokes the same entry via the Dockerfile CMD.
 */
import app from './hono';
import logger from '@/lib/logger';

const port = Number(process.env.PORT) || 8081;

logger.log(`[Server] Listening on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
