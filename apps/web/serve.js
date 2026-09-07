import { serve } from "srvx";
import { serveStatic } from "srvx/static";

import handler from "./dist/server/server.js";

/**
 * The production process for the portal.
 *
 * `vite build` emits a request handler (`dist/server/server.js`) and a folder of
 * client assets (`dist/client`). Start's hosting guide is explicit that serving
 * those files is the host's job: static assets come from the client directory,
 * and every other request goes to the handler. `vite preview` does this in
 * development; this does it in production.
 *
 * srvx is the tool that guide names, and Start already depends on it — Start's
 * own preview server runs on srvx. Plain JavaScript so `node` can run it with
 * no build step of its own.
 */
serve({
  // Runs first, and falls through to the handler when no file matches.
  middleware: [serveStatic({ dir: "./dist/client" })],
  fetch: (request) => handler.fetch(request),
  // Railway injects PORT at run time. The default matches the dev server.
  port: process.env.PORT ?? 3000,
});
