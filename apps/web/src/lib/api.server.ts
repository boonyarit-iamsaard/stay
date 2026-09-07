import { env as publicEnv } from "@stay/env/web";
import { env } from "@stay/env/web-server";
import { getRequestHeaders } from "@tanstack/react-start/server";

import {
  forwardedSsrHeaders,
  joinApiPath,
  resolveApiBaseUrl,
} from "./api-client";

/**
 * The server-rendering half of {@link import("./api").apiFetch}. Kept in
 * its own module so the browser bundle never pulls in server-only environment.
 */
export async function ssrApiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = joinApiPath(
    resolveApiBaseUrl({
      isServer: true,
      publicUrl: publicEnv.VITE_SERVER_URL,
      internalUrl: env.SERVER_INTERNAL_URL,
    }),
    path,
  );

  const headers = forwardedSsrHeaders(new Headers(getRequestHeaders()));

  for (const [name, value] of new Headers(init?.headers)) {
    headers.set(name, value);
  }

  return fetch(url, { ...init, headers });
}
