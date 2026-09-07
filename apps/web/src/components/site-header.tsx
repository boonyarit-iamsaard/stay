import { Link } from "@tanstack/react-router";

import { UserMenuContainer } from "@/features/auth";
import { siteContent } from "@/site-content";

/** The portal's masthead. Rendered on the server for public pages. */
export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold">
          {siteContent.brand}
        </Link>
        <UserMenuContainer />
      </div>
    </header>
  );
}
