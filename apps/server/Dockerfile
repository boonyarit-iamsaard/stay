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

ENV NODE_ENV=production
RUN cd apps/server && pnpm run build

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app

USER node

EXPOSE 5000

WORKDIR /app/apps/server
CMD ["node", "dist/index.mjs"]
