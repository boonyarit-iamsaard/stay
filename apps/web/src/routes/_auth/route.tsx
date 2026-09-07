import { createFileRoute, Outlet } from "@tanstack/react-router";

import { redirectIfSignedIn } from "@/features/auth";

/**
 * A SPA, like every signed-in screen: the guard reads the session from the
 * browser, where the auth client lives. Selective SSR only lets a child route
 * become *more* restrictive than its parent, so `ssr: false` here also holds
 * for anything added underneath.
 */
export const Route = createFileRoute("/_auth")({
  ssr: false,
  beforeLoad: redirectIfSignedIn,
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
