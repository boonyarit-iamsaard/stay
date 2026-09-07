import { serve } from "@hono/node-server";
import { auth } from "@stay/auth";
import { env } from "@stay/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("OK");
});

/**
 * Throwaway. It exists so the portal has something real to server-render
 * against while the booking API is still being built, and so container
 * healthchecks have a JSON endpoint. Delete it once real resources land.
 */
app.get("/health", (c) => {
  return c.json({ status: "ok", checkedAt: new Date().toISOString() });
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
