import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

/**
 * CORS_ORIGIN env var:
 *   - unset            → "*" (dev convenience; warned in logs at startup)
 *   - single value     → exact origin match (e.g. "https://iris-wellness.mojjo.se")
 *   - comma-separated  → multi-origin; matched against the request's Origin header
 *                        (e.g. "https://iris-wellness.mojjo.se,https://admin.iris-wellness.mojjo.se")
 *
 * Native iOS/Android apps don't send an Origin header at all, so this gate only
 * affects browser-based callers (admin dashboard, marketing site, future web app).
 */
const corsOriginEnv = process.env.CORS_ORIGIN?.trim();
let corsOriginConfig: string | string[];
if (!corsOriginEnv) {
  console.warn("[CORS] CORS_ORIGIN env var not set — falling back to '*'. Set explicitly in production.");
  corsOriginConfig = "*";
} else if (corsOriginEnv.includes(",")) {
  corsOriginConfig = corsOriginEnv.split(",").map((o) => o.trim()).filter(Boolean);
  console.log("[CORS] Multi-origin allowlist:", corsOriginConfig);
} else {
  corsOriginConfig = corsOriginEnv;
  console.log("[CORS] Single allowed origin:", corsOriginConfig);
}

app.use("*", cors({ origin: corsOriginConfig }));

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
