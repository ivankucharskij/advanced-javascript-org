# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN npm install --global pnpm@9.0.0

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN pnpm install --frozen-lockfile --filter api...

FROM deps AS builder
COPY apps/api apps/api
COPY packages/shared-types packages/shared-types
COPY packages/eslint-config packages/eslint-config
RUN pnpm --filter @repo/shared-types build
WORKDIR /app/apps/api
RUN pnpm build

FROM base AS runner
ENV NODE_ENV="production"
ENV PORT="8080"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile --prod --filter api...

COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/packages/shared-types/dist packages/shared-types/dist

WORKDIR /app/apps/api
EXPOSE 8080
USER node
CMD ["node", "dist/server.js"]
