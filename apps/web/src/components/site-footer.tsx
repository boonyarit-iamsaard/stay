import { siteContent } from "@/site-content";

/** The portal's footer. */
export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-3xl px-4 py-6 text-muted-foreground text-sm">
        {siteContent.footer.copyright(new Date().getFullYear())}
      </div>
    </footer>
  );
}
