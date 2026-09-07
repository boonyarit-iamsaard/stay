import { env } from "@stay/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // better-auth derives its route-matching base from this URL's path, so the
  // public auth path must equal the server-side mount (/api/auth everywhere).
  //
  // Always the public origin, never the private network address: every call
  // this client makes is made by the browser. In production the API sits on the
  // same parent domain as the portal, which is what lets the session cookie be
  // shared with server-rendered pages (docs/adr/0001).
  baseURL: new URL("/api/auth", env.VITE_SERVER_URL).toString(),
});
