# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN apk add --no-cache libc6-compat && corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS builder
ENV LOCAL_API_URL="http://127.0.0.1:8081"
COPY . .
RUN pnpm --filter api prisma:generate
RUN pnpm --filter @repo/shared-types build
RUN pnpm --filter api build
RUN pnpm --filter web build

FROM base AS runner
ENV NODE_ENV="production"
ENV PORT="8080"
ENV API_PORT="8081"
ENV HOSTNAME="0.0.0.0"
ENV LOCAL_API_URL="http://127.0.0.1:8081"
ENV NEXT_TELEMETRY_DISABLED="1"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile --prod --filter api --ignore-scripts

COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/prisma apps/api/prisma
COPY --from=builder /app/packages/shared-types/dist packages/shared-types/dist
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static apps/web/.next/static
COPY infra/start.mjs infra/start.mjs

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 appuser \
  && chown -R appuser:nodejs /app

USER appuser
EXPOSE 8080
CMD ["node", "infra/start.mjs"]
