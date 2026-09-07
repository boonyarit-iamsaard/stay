import { env } from "@stay/env/web";
import { createIsomorphicFn } from "@tanstack/react-start";
import { ssrApiFetch } from "./api.server";
import { joinApiPath, resolveApiBaseUrl } from "./api-client";

/**
 * Calls `apps/server`, from wherever the caller happens to be running.
 *
 * A loader on a server-rendered route runs on the server for the first request
 * and in the browser for every navigation after it, so both paths have to work.
 * `createIsomorphicFn` is the compiler boundary Start recognises: it keeps each
 * half in its own build and prunes the other one — including its imports, which
 * is what keeps the server-only module out of the browser bundle.
 */
export const apiFetch = createIsomorphicFn()
  .server(
    (path: string, init?: RequestInit): Promise<Response> =>
      ssrApiFetch(path, init),
  )
  .client((path: string, init?: RequestInit): Promise<Response> => {
    const url = joinApiPath(
      resolveApiBaseUrl({ isServer: false, publicUrl: env.VITE_SERVER_URL }),
      path,
    );

    // The session cookie is on the parent domain, so the browser will attach it.
    return fetch(url, { ...init, credentials: "include" });
  });
