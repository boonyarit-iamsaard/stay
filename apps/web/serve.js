import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import handler from "./dist/server/server.js";

/**
 * The production process for the portal.
 *
 * `vite build` emits a request handler (`dist/server/server.js`) and a folder of
 * client assets (`dist/client`); serving those files is the host's job, which
 * `vite preview` does in development and this does in production. Plain
 * JavaScript so `node` can run it with no build step of its own.
 */
const app = new Hono();

app.use(
  "/*",
  serveStatic({
    root: "./dist/client",
    onFound: (_path, c) => {
      // Asset filenames carry a content hash, so they can be cached forever.
      c.header("cache-control", "public, immutable, max-age=31536000");
    },
  }),
);

app.all("/*", (c) => handler.fetch(c.req.raw));

// Railway injects PORT at run time. The default matches the dev server.
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Portal is running on http://localhost:${info.port}`);
});
