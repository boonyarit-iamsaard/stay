import { Button } from "@stay/ui/components/button";
import { Link } from "@tanstack/react-router";

import { siteContent } from "@/site-content";

const content = siteContent.notFound;

/**
 * The router's fallback for an unmatched URL. Registered once on the router as
 * `defaultNotFoundComponent`, so every route gets it without opting in.
 */
export function NotFound() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-semibold text-3xl tracking-tight">{content.title}</h1>
      <p className="mt-2 text-muted-foreground">{content.description}</p>

      <Link to="/">
        <Button className="mt-6">{content.backHome}</Button>
      </Link>
    </div>
  );
}
