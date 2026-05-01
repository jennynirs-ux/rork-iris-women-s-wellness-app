# IRIS backend — Bun runtime on Fly.io
# Build stage: install dependencies
FROM oven/bun:1.3 AS deps
WORKDIR /app

# Cache deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Runtime stage
FROM oven/bun:1.3-slim
WORKDIR /app

# Copy installed deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 8081

CMD ["bun", "run", "backend/server.ts"]
