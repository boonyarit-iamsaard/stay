FROM node:24-slim AS builder
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1

# Honours the packageManager pin and its integrity hash; `npm i -g pnpm@11` would not.
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack install

# Reviewed: .dockerignore excludes VCS data, dependencies, build output, logs,
# deployment metadata, and every .env variant except documented examples.
COPY . .

RUN --mount=type=cache,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store

# Baked into the bundle at build time: the browser reads it, not the container.
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

ENV NODE_ENV=production
RUN cd apps/staff && pnpm run build

# The staff app is a client-rendered SPA, so the image only has to hand out
# files and send unknown paths to index.html for the router to resolve.
FROM caddy:2-alpine AS runner
COPY --from=builder /app/apps/staff/dist /srv
COPY apps/staff/Caddyfile /etc/caddy/Caddyfile

EXPOSE 4000
