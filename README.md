# Fullstack Monorepo

## Overview

This workspace contains:

- `apps/api` - Hono API with OpenAPI route definitions and Swagger UI
- `apps/web` - Next.js web app with App Router routes and feature code under `src/features`
- `packages/database` - Prisma schema, generated client, and local Postgres setup
- `packages/api-client` - generated API types/client package from the API OpenAPI spec
- `packages/ui` - shared UI package
- `packages/eslint-config` - shared ESLint config
- `packages/typescript-config` - shared TypeScript config

Package manager: `pnpm`

## Workspace Commands

Install dependencies:

```bash
pnpm install
```

Run all dev tasks:

```bash
pnpm dev
```

Build the workspace:

```bash
pnpm build
```

Lint the workspace:

```bash
pnpm lint
```

Type-check tasks configured in Turbo:

```bash
pnpm check-types
```

## App Commands

API only:

```bash
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api start
pnpm --filter api lint
```

Web only:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
pnpm --filter web lint
```

## Database

Start local Postgres:

```bash
pnpm db:up
```

Generate Prisma client:

```bash
pnpm --filter @repo/database prisma:generate
```

Create/apply a development migration:

```bash
pnpm --filter @repo/database prisma:migrate:dev -- --name your_migration_name
```

The database package keeps its Prisma schema in:

```text
packages/database/prisma/schema.prisma
```

## API Docs

When the API is running:

- OpenAPI JSON: `http://localhost:8080/doc`
- Swagger UI: `http://localhost:8080/swagger`

## Environment

Useful env files:

- `apps/api/.env.example`
- `apps/web/.env.local`
- `packages/database/.env.example`

The API reads:

- `PORT`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME`
- `ADMIN_BIRTH_DATE`
- `DATABASE_URL`

The web app reads:

- `LOCAL_API_URL`

## Notes

- Task records belong to a user.
- Protected API routes use Hono middleware auth and store the authenticated user in context.
- The API package runs from source with `tsx`; it does not rely on a separate runtime `dist` export from `@repo/database`.
