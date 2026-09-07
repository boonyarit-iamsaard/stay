# TanStack Start for the customer portal

`apps/web` is the customer-facing portal for browsing and booking homestays, and it
needs organic search traffic on its public pages. We chose **TanStack Start**, rendered
server-side only on the public routes, over Next.js.

## Considered Options

**Next.js** was the obvious candidate and was rejected. **Plain TanStack Router with
"selective SSR"** was considered but is not a real option: selective SSR is a Start
feature, so that choice collapses into either Start or a client-only SPA with
prerendered pages.

The decisive reasons for Start:

- **Router continuity.** `apps/staff` already runs TanStack Router. Both frontends
  share `createFileRoute`, loaders, typed search params, and `packages/ui`. Next.js
  would put a second routing model and a second build system into a three-app repo.
- **SSR is opt-in.** The portal is mostly authenticated screens (booking flow,
  account, messaging) with a small public surface (home, `/stays/$slug`, location
  pages). Start lets those authenticated routes stay a SPA and turns rendering on only
  where it earns its cost. Next.js has you opting _out_ of server rendering, which is
  backwards for this shape.
- **One toolchain.** Both frontends stay on Vite.

Next.js's genuine advantage is `next/image`, which matters for image-heavy listing and
gallery pages. It is neutralised by putting an image CDN in front of S3-compatible
storage — a pipeline we want regardless of framework, and one that beats on-the-fly
optimisation for staff-uploaded photos that rarely change.

## How the hosting target moved

This decision was first made when the repo deployed to Cloudflare Workers (the
`create-better-t-stack` scaffold, `packages/infra` + Alchemy). Under that assumption a
large part of the argument was that Start deploys to Workers natively while Next.js
needs OpenNext. **That premise no longer holds**: `apps/server`, Postgres, and now
`apps/web` run on Railway, where Node is first-class and Next.js needs no adapter at
all.

This is recorded deliberately. The recommendation survived losing its
deployment-shaped argument and now rests on router continuity, opt-in SSR, and
toolchain unity. A future reader should know the Cloudflare argument was load-bearing
and was dropped, rather than assume it never applied.

## Consequences

- `packages/infra` (Alchemy/Cloudflare) is removed. Everything runs on Railway:
  `web`, `server`, `staff` (static SPA), and Postgres.
- `apps/server` remains the single API. `apps/web` calls it over Railway's private
  network during SSR; it does not open a second path into `@stay/db`. Booking,
  availability, and pricing rules stay in one place.
- Authenticated screens live under the `_account` and `_auth` pathless layouts,
  which set `ssr: false`; the public `_public` layout sets `ssr: true`. A route
  added under those layouts therefore cannot accidentally server-render and fail
  on a missing session.

  This is not the shape first written down here, which was "the root route sets
  `ssr: false`; public routes opt in". That does not work: Start's selective SSR
  lets a child route make its inherited value _more_ restrictive only, so under
  an `ssr: false` root a public route's `ssr: true` is ignored — as is a route's
  `ssr: true` under `defaultSsr: false`. Both were tried against a real build,
  and both left every route client-rendered. Opting out per subtree gets the
  property the decision was after, one layout lower down.

  The guarantee is therefore scoped to those two subtrees: a route added
  _outside_ them inherits the root, which server-renders. Authenticated screens
  belong under `_account`.

- `apps/web` and `apps/server` must sit on a shared parent domain (`foo.com` /
  `api.foo.com`) with Better Auth `crossSubDomainCookies` scoped to `.foo.com`, so
  SSR loaders can forward the session cookie. **Custom domains are mandatory in every
  environment that server-renders authenticated pages**: Railway's generated
  `*.up.railway.app` hostnames are on the Public Suffix List, so browsers refuse to
  set a cookie scoped across them.
- Whether `apps/staff` sits inside that `.foo.com` cookie scope is left open. Hosting
  it on a separate domain keeps customer session cookies out of the staff origin's
  blast radius.
