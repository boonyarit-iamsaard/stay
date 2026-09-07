import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * The environment of the portal's SSR process — not the browser bundle, and not
 * the API. It deliberately holds no database credentials: `apps/web` reaches its
 * data through `apps/server` only (docs/adr/0001).
 */
export const env = createEnv({
  server: {
    // Railway's private network address for `apps/server`, e.g.
    // `http://server.railway.internal:4000`. SSR loaders prefer it so the call
    // never leaves the project; the browser keeps using VITE_SERVER_URL.
    // Unset in local development, where the public URL is already local.
    SERVER_INTERNAL_URL: z.url().optional(),
    // Railway injects PORT at run time. The default covers local development.
    PORT: z.coerce.number().int().positive().default(3001),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
