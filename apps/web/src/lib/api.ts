import { env } from "@stay/env/web";

import { joinApiPath, resolveApiBaseUrl } from "./api-client";

/**
 * Calls `apps/server`, from wherever the caller happens to be running.
 *
 * A loader on a server-rendered route runs on the server for the first request
 * and in the browser for every navigation after it, so both paths have to work.
 * The SSR half lives in a separate module: it reads server-only environment and
 * the in-flight request, and `import.meta.env.SSR` keeps it out of the browser
 * bundle entirely.
 */
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  if (import.meta.env.SSR) {
    const { ssrApiFetch } = await import("./api.server");

    return ssrApiFetch(path, init);
  }

  const url = joinApiPath(
    resolveApiBaseUrl({ isServer: false, publicUrl: env.VITE_SERVER_URL }),
    path,
  );

  // The session cookie is on the parent domain, so the browser will attach it.
  return fetch(url, { ...init, credentials: "include" });
}
