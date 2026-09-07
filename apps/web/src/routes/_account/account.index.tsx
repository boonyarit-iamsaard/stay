import { createFileRoute } from "@tanstack/react-router";

import { useSession } from "@/features/auth";
import { siteContent } from "@/site-content";

const content = siteContent.account;

export const Route = createFileRoute("/_account/account/")({
  component: AccountPage,
});

function AccountPage() {
  const { user } = useSession();

  return (
    <>
      <h1 className="font-semibold text-2xl tracking-tight">{content.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {user ? content.signedInAs(user.email) : null}
      </p>
    </>
  );
}
