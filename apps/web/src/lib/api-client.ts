/**
 * Headers an SSR call is allowed to carry from the browser's request into the
 * API call. The session cookie is the one that matters — it is what lets a
 * server-rendered page know who is looking at it — and the other two only
 * affect what the API would return anyway.
 *
 * Everything else is dropped on purpose: `host`, `x-forwarded-*` and
 * `content-length` describe the request to the *portal*, and forwarding them
 * would misdescribe the request to the API.
 */
const FORWARDED_SSR_HEADERS = ["cookie", "accept-language", "user-agent"];

export interface ApiBaseUrlOptions {
  /** True while server-rendering, false in the browser. */
  isServer: boolean;
  /** The origin the browser can reach, e.g. `https://api.foo.com`. */
  publicUrl: string;
  /** Railway's private network address, used only during SSR. */
  internalUrl?: string | undefined;
}

/**
 * Picks the API origin for the environment the call is made from. During SSR
 * the private network address keeps the request inside the Railway project;
 * the browser has no route to it and uses the public origin.
 */
export function resolveApiBaseUrl({
  isServer,
  publicUrl,
  internalUrl,
}: ApiBaseUrlOptions): string {
  const internal = internalUrl?.trim();
  const chosen = isServer && internal ? internal : publicUrl;

  return chosen.trim().replace(/\/+$/, "");
}

/** Joins an API origin and a path with exactly one slash between them. */
export function joinApiPath(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/** Narrows the incoming request's headers to the allowlist above. */
export function forwardedSsrHeaders(incoming: Headers | undefined): Headers {
  const forwarded = new Headers();

  if (!incoming) {
    return forwarded;
  }

  for (const name of FORWARDED_SSR_HEADERS) {
    const value = incoming.get(name);

    if (value) {
      forwarded.set(name, value);
    }
  }

  return forwarded;
}
