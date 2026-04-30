# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile --filter api...

FROM deps AS builder
COPY apps/api apps/api
COPY packages/eslint-config packages/eslint-config
COPY packages/typescript-config packages/typescript-config
WORKDIR /app/apps/api
RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runner
ENV NODE_ENV="production"
ENV PORT="8080"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --prod --filter api

COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/prisma apps/api/prisma

WORKDIR /app/apps/api
EXPOSE 8080
USER node
CMD ["node", "dist/server.js"]
