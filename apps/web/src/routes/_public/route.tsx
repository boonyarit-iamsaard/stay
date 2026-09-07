import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Everything under here is public and wants to be found by a search engine, so
 * it is server-rendered. `ssr: true` is the framework default and is stated
 * anyway: it is the property these routes exist for.
 */
export const Route = createFileRoute("/_public")({
  ssr: true,
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto]">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
