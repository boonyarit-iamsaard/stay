import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/features/auth";

/**
 * The signed-in half of the portal, and a SPA. `requireSession` reads the
 * session from the browser and so never runs against a request the server
 * cannot authenticate.
 *
 * `ssr: false` sits on the layout rather than on each page because selective
 * SSR only lets a child route become *more* restrictive than its parent: a new
 * route added under here cannot opt itself back into server rendering and fail
 * on a missing session. That is why every authenticated screen belongs in this
 * subtree (docs/adr/0001).
 */
export const Route = createFileRoute("/_account")({
  ssr: false,
  beforeLoad: requireSession,
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr]">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
