import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { parseOriginList } from "./origins";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    // A comma-separated list: the portal and the staff app both call this API.
    CORS_ORIGIN: z
      .string()
      .min(1)
      .transform(parseOriginList)
      .pipe(z.array(z.url()).min(1)),
    // The parent domain the session cookie is scoped to, e.g. `.foo.com`. Unset
    // in local development, where web, staff and the API share `localhost`.
    // Railway's `*.up.railway.app` hostnames are on the Public Suffix List, so a
    // cookie cannot be scoped across them: every server-rendering environment
    // needs real custom domains. See docs/adr/0001.
    COOKIE_DOMAIN: z.string().min(1).optional(),
    // Railway injects PORT at run time. The default covers local development.
    PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
