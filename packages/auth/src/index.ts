import { createDb } from "@stay/db";
import * as schema from "@stay/db/schema/auth";
import { env } from "@stay/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),
    trustedOrigins: env.CORS_ORIGIN,
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      database: {
        // The database owns id generation: every `id` column defaults to
        // `uuidv7()`. Do not use "uuid" here — that mode makes Better Auth
        // generate a v4 id itself, and its validation rejects v7 ids.
        generateId: false,
      },
      // The portal server-renders its public pages, and an SSR loader can only
      // forward a session cookie the browser actually sent it. That needs the
      // cookie scoped to the parent domain shared by `foo.com` and
      // `api.foo.com`. Left off locally, where everything is on `localhost`.
      ...(env.COOKIE_DOMAIN
        ? {
            crossSubDomainCookies: {
              enabled: true,
              domain: env.COOKIE_DOMAIN,
            },
          }
        : {}),
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [],
  });
}

export const auth = createAuth();
