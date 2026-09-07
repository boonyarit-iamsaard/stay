/**
 * Route paths the auth feature navigates to. Keep them here so the guards, the
 * hooks and the links all read the same value.
 */
export const AUTH_ROUTES = {
  signIn: "/login",
  signUp: "/sign-up",
  account: "/account",
  afterSignIn: "/account",
  afterSignOut: "/",
} as const;
