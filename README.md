# Fullstack Monorepo

## Dev Start

Install dependencies:

```bash
pnpm install
```

Start Postgres:

```bash
pnpm db:up
```

Create local API env:

```bash
cp apps/api/.env.example apps/api/.env
```

Apply migrations and generate the Prisma client:

```bash
pnpm db:migrate:dev
pnpm db:generate
```

Generate API client types:

```bash
pnpm --filter api dev
```

Then, in another terminal:

```bash
pnpm generate:api-client
```

Seed local demo data:

```bash
pnpm seed
```

Start the API and web app with one command:

```bash
pnpm dev
```

Local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger`

Demo credentials:

- Admin: `admin@example.com` / `admin12345`
- User: `user@example.com` / `user12345`

## Overview

This workspace contains:

- `apps/api` - Hono API with OpenAPI route definitions and Swagger UI
- `apps/web` - Next.js web app with App Router routes and feature code under `src/features`
- `apps/api/prisma` - Prisma schema, migrations, generated client, and local Postgres setup
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

TypeScript checks run as part of each package `lint` script.

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
pnpm db:generate
```

Create/apply a development migration:

```bash
pnpm db:migrate:dev -- --name your_migration_name
```

Apply existing migrations to the shared/production database before deploying the API:

```bash
pnpm db:migrate:deploy
```

The API package keeps its Prisma schema in:

```text
apps/api/prisma/schema.prisma
```

## API Docs

When the API is running:

- OpenAPI JSON: `http://localhost:8080/doc`
- Swagger UI: `http://localhost:8080/swagger`

## API Client

The generated API types are written to `packages/api-client/src/generated`.
Run this after the API is running:

```bash
pnpm generate:api-client
```

## Environment

Useful env files:

- `apps/api/.env.example`
- `apps/web/.env.local`

The API reads:

- `PORT`
- `AUTH_SECRET`
- `DATABASE_URL`

The web app reads:

- `LOCAL_API_URL`

## Notes

- Task records belong to a user.
- Protected API routes use Hono middleware auth and store the authenticated user in context.
- The API owns Prisma because it is the only service that talks directly to the database.
