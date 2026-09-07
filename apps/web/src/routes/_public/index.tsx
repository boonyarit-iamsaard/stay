import { createFileRoute } from "@tanstack/react-router";

import { fetchApiHealth } from "@/features/health";
import { siteContent } from "@/site-content";

const content = siteContent.home;

export const Route = createFileRoute("/_public/")({
  // Inherits `ssr: true` from the `_public` layout: this page is rendered on
  // the server, and its loader runs there for the first request.
  loader: () => fetchApiHealth(),
  component: HomePage,
});

function HomePage() {
  const health = Route.useLoaderData();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-semibold text-3xl tracking-tight">{content.title}</h1>
      <p className="mt-2 text-muted-foreground">{content.tagline}</p>

      <section className="mt-8 rounded-lg border p-4">
        <h2 className="mb-2 font-medium">{content.apiStatus.heading}</h2>
        <p className="text-muted-foreground text-sm">
          {health.status === "ok"
            ? content.apiStatus.reachable(health.checkedAt)
            : content.apiStatus.unreachable}
        </p>
      </section>
    </div>
  );
}
