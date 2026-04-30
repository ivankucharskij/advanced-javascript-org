# API

## Overview

`apps/api` is a Hono-based API server with:

- `@hono/zod-openapi` for typed routes and OpenAPI generation
- `@hono/swagger-ui` for interactive docs
- auth middleware for protected routes
- Prisma-backed persistence owned by the API package

## Run

From the repo root:

```bash
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate:dev
pnpm db:generate
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api start
pnpm --filter api lint
```

Default local port:

```text
8080
```

## Docs

When the server is running:

- OpenAPI JSON: `/doc`
- Swagger UI: `/swagger`

## Docker

Build the API image from the repo root:

```bash
docker build -f apps/api/Dockerfile -t fullstack-api .
```

Run it locally:

```bash
docker run --env-file apps/api/.env -p 8080:8080 fullstack-api
```

When using Docker `--env-file`, keep values unquoted:

```env
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
```

## Structure

Core files:

- `src/server.ts` - app and server bootstrap
- `src/router.ts` - top-level feature router mounting
- `src/openapi.ts` - OpenAPI document metadata

Feature folders:

- `src/features/health`
- `src/features/tasks`
- `src/features/users`

Shared API helpers:

- `src/middleware/auth.ts`
- `src/shared/http-result.ts`
- `src/shared/http-status.ts`
- `src/shared/schemas.ts`

## Auth

Protected routes use `src/middleware/auth.ts`.

That middleware:

- reads the bearer token from `Authorization`
- resolves the current user through `usersStore.authorize(...)`
- stores the user on `c.var.currentUser`

## Tasks

Tasks belong to a specific user.

Current task behavior:

- task reads are scoped to the authenticated user
- task writes are scoped to the authenticated user
- parent task links must point to a task owned by the same user
- bulk delete exists on `DELETE /api/tasks`

## Environment

See:

```text
apps/api/.env.example
```

Main variables:

- `PORT`
- `AUTH_SECRET`
- `DATABASE_URL`

Run this before deploying the API container to apply existing migrations to the configured database:

```bash
pnpm db:migrate:deploy
```

## Seed

Seed local demo users and tasks from the repo root:

```bash
pnpm seed
```

The seed command creates:

- Admin: `admin@example.com` / `admin12345`
- User: `user@example.com` / `user12345`
