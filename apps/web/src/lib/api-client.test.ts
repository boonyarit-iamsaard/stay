import { describe, expect, it } from "vitest";

import {
  forwardedSsrHeaders,
  joinApiPath,
  resolveApiBaseUrl,
} from "./api-client";

describe("resolveApiBaseUrl", () => {
  it("uses the public URL in the browser even when an internal URL is set", () => {
    expect(
      resolveApiBaseUrl({
        isServer: false,
        publicUrl: "https://api.foo.com",
        internalUrl: "http://server.railway.internal:4000",
      }),
    ).toBe("https://api.foo.com");
  });

  it("prefers the internal URL during SSR", () => {
    expect(
      resolveApiBaseUrl({
        isServer: true,
        publicUrl: "https://api.foo.com",
        internalUrl: "http://server.railway.internal:4000",
      }),
    ).toBe("http://server.railway.internal:4000");
  });

  it("falls back to the public URL during SSR when no internal URL is set", () => {
    expect(
      resolveApiBaseUrl({
        isServer: true,
        publicUrl: "https://api.foo.com",
        internalUrl: undefined,
      }),
    ).toBe("https://api.foo.com");
  });

  it("ignores a blank internal URL", () => {
    expect(
      resolveApiBaseUrl({
        isServer: true,
        publicUrl: "https://api.foo.com",
        internalUrl: "  ",
      }),
    ).toBe("https://api.foo.com");
  });

  it("strips a trailing slash so paths join predictably", () => {
    expect(
      resolveApiBaseUrl({ isServer: false, publicUrl: "https://api.foo.com/" }),
    ).toBe("https://api.foo.com");
  });
});

describe("joinApiPath", () => {
  it("joins a base and a path with exactly one slash", () => {
    expect(joinApiPath("https://api.foo.com", "/health")).toBe(
      "https://api.foo.com/health",
    );
    expect(joinApiPath("https://api.foo.com", "health")).toBe(
      "https://api.foo.com/health",
    );
  });

  it("keeps a query string intact", () => {
    expect(joinApiPath("https://api.foo.com", "/health?verbose=1")).toBe(
      "https://api.foo.com/health?verbose=1",
    );
  });
});

describe("forwardedSsrHeaders", () => {
  it("forwards the session cookie", () => {
    const forwarded = forwardedSsrHeaders(
      new Headers({ cookie: "better-auth.session_token=abc" }),
    );

    expect(forwarded.get("cookie")).toBe("better-auth.session_token=abc");
  });

  it("forwards the headers that shape a rendered page", () => {
    const forwarded = forwardedSsrHeaders(
      new Headers({
        "accept-language": "th-TH,th;q=0.9",
        "user-agent": "Mozilla/5.0",
      }),
    );

    expect(forwarded.get("accept-language")).toBe("th-TH,th;q=0.9");
    expect(forwarded.get("user-agent")).toBe("Mozilla/5.0");
  });

  it("drops everything else, so nothing about the web origin leaks into the API call", () => {
    const forwarded = forwardedSsrHeaders(
      new Headers({
        host: "foo.com",
        "x-forwarded-for": "203.0.113.1",
        "content-length": "0",
        authorization: "Bearer leaked",
      }),
    );

    expect([...forwarded.keys()]).toEqual([]);
  });

  it("returns an empty set when there is no incoming request", () => {
    expect([...forwardedSsrHeaders(undefined).keys()]).toEqual([]);
  });
});
