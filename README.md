# stay

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TanStack Start** - Server rendering for the portal's public pages
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Hono** - Lightweight, performant server framework
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Environment Variables

Each `.env.example` file lists the variables that the app needs. Copy the
examples, then replace the values:

```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/staff/.env.example apps/staff/.env
cp apps/web/.env.example apps/web/.env
```

The staff app runs on port 3000, the customer portal on 3001, and the server on
port 4000. `CORS_ORIGIN` is a comma-separated list, because both frontends call
the same API.

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm run db:push
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) for the customer portal and
[http://localhost:3000](http://localhost:3000) for the staff application.
The API is running at [http://localhost:4000](http://localhost:4000).

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json`, `apps/web/components.json` and `apps/staff/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@stay/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web` or `apps/staff`.

## Deployment

Everything runs on Railway: `web`, `server`, `staff`, and Postgres. Each app has
a Dockerfile and is deployed as its own service.

| Service  | Dockerfile               | Port | Notes                            |
| -------- | ------------------------ | ---- | -------------------------------- |
| `web`    | `apps/web/Dockerfile`    | 3001 | Customer portal, server-rendered |
| `server` | `apps/server/Dockerfile` | 4000 | The single API                   |
| `staff`  | `apps/staff/Dockerfile`  | 3000 | Static SPA, served by Caddy      |

### Custom domains are mandatory

`web` and `server` must sit on a shared parent domain — `foo.com` and
`api.foo.com` — with `COOKIE_DOMAIN=.foo.com` set on the server. Better Auth
then scopes the session cookie to the parent domain, which is what lets the
portal's SSR loaders forward it to the API.

Railway's generated `*.up.railway.app` hostnames are on the Public Suffix List,
so a browser refuses to set a cookie across them. Any environment that
server-renders a page which depends on a session needs real domains. See
[docs/adr/0001](docs/adr/0001-tanstack-start-for-customer-portal.md).

### Build-time vs run-time variables

`VITE_SERVER_URL` is read by the browser, so it is baked into the client bundle
during `docker build` and passed as a build argument, not an environment
variable. `web` and `staff` therefore need one image per environment.

`SERVER_INTERNAL_URL` is the opposite: it is read only by the portal's SSR
process, at run time. Point it at the API's private network address
(`http://server.railway.internal:4000`) so server-rendered requests never leave
the project.

### Docker Compose

Compose covers two jobs, split across two files:

- `docker-compose.yml` — local infrastructure only: Postgres today, Mailpit
  later. This is what `pnpm dev` runs against.
- `docker-compose.override.yml` — the three apps, built from the same
  Dockerfiles Railway builds. Compose merges it automatically, so `pnpm
docker:up` reproduces production locally.

```bash
pnpm db:start     # Postgres alone, for running the apps from source
pnpm docker:up    # everything, built from the Dockerfiles
pnpm docker:logs
pnpm docker:down
```

What this does not reproduce is the cookie scope: on localhost the apps differ
by port, and ports are not part of a cookie's origin, so the session is shared
for a different reason than it is in production. Only a real domain exercises
that path.

## Git Hooks and Formatting

- Initialize hooks: `pnpm run prepare`
- Run checks: `pnpm run check`

## Project Structure

```text
stay/
├── apps/
│   ├── web/         # Customer portal (React + TanStack Start, server-rendered)
│   ├── staff/       # Staff frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── auth/        # Authentication configuration & logic
│   ├── env/         # Validated environment variables
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:staff`: Start only the staff application
- `pnpm run dev:web`: Start only the customer portal
- `pnpm run dev:server`: Start only the server
- `pnpm run types:check`: Check TypeScript types across all apps
- `pnpm run test`: Run the test suite
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:generate`: Generate database client/types
- `pnpm run db:migrate`: Run database migrations
- `pnpm run db:studio`: Open database studio UI
- `pnpm run check`: Run Biome formatting and linting
- `pnpm run docker:build`: Build the Docker Compose images
- `pnpm run docker:up`: Build and start the Docker Compose stack
- `pnpm run docker:logs`: Tail logs from the Docker Compose stack
- `pnpm run docker:down`: Stop the Docker Compose stack
