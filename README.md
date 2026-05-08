# Node Next Hono Prisma Monorepo

Рабочее fullstack-приложение для управления задачами: авторизация, роли,
CRUD задач, фильтры, OpenAPI-контракт, сгенерированный TypeScript API client,
Next.js frontend и Hono/Prisma backend.

## Deploy

- Frontend развернут на Vercel. Это удобно для публичной демонстрации: быстрые
  preview/production deployments и аккуратные домены вида `*.vercel.app`.
- Backend деплоится через GitHub Actions в Yandex Cloud Serverless Containers.
- Docker image API собирается из `apps/api/Dockerfile` и публикуется в Yandex
  Container Registry.
- Workflow деплоя: `.github/workflows/deploy-api-yc.yml`.
- Web ходит в API через `LOCAL_API_URL`, backend ограничивает origin через
  `WEB_ORIGIN`.

## Stack

- Monorepo: `pnpm`, Turborepo.
- Backend: Node.js, TypeScript, Hono, Zod, `@hono/zod-openapi`, Swagger UI.
- Database: PostgreSQL, Prisma, migrations, seed script.
- Frontend: Next.js App Router, React, TypeScript, MUI, SWR, axios.
- Contract: OpenAPI JSON + generated TypeScript types through Orval.
- CI/CD: GitHub Actions, Docker, Yandex Cloud.

## Repository Map

```text
apps/
  api/             # Hono API, Prisma, OpenAPI, auth, users, tasks
  web/             # Next.js frontend
packages/
  api-client/      # generated types from OpenAPI
  eslint-config/   # shared ESLint config
  typescript-config/
```

## Code Highlights

- `apps/api/src/features/tasks` - task schemas, routes, service layer and Prisma
  repository.
- `apps/api/src/features/users` - registration, login, roles, user blocking and
  auth middleware.
- `apps/api/prisma/schema.prisma` - database schema, relations, indexes and
  enums.
- `apps/web/src/features/tasks` - task table, filters, forms, hooks and API
  integration.
- `packages/api-client` - committed OpenAPI snapshot and generated TypeScript
  types.

## Local Run

Requirements:

- Node.js 18+
- pnpm 9+
- Docker

Install dependencies:

```bash
pnpm install
```

Create API env:

```bash
cp apps/api/.env.example apps/api/.env
```

PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

Start PostgreSQL:

```bash
docker compose -f apps/api/compose.yaml up -d
```

Apply migrations, generate Prisma client and seed demo data:

```bash
pnpm db:migrate:dev
pnpm db:generate
pnpm seed
```

Start API and web:

```bash
pnpm dev
```

Local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger`
- OpenAPI JSON: `http://localhost:8080/doc`

Demo users:

- Admin: `admin@example.com` / `admin12345`
- User: `user@example.com` / `user12345`

## API

Main routes:

- `GET /api/healthz`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PATCH /api/tasks/{id}`
- `DELETE /api/tasks`
- `GET /api/users`
- `GET /api/users/{id}`
- `PATCH /api/users/{id}/block`

Feature modules follow one structure:

- `*.controller.ts` - HTTP routes and response mapping.
- `*.service.ts` - business rules and access checks.
- `*.repository.ts` - Prisma/PostgreSQL access.
- `*.schemas.ts` - Zod request/response schemas.
- `*.openapi.ts` - OpenAPI route descriptions.

## API Client

Generate types after starting the API:

```bash
pnpm generate:api-client
```

The generator reads `http://127.0.0.1:8080/doc` and writes into
`packages/api-client/src/generated`.

## Commands

```bash
pnpm build
pnpm lint
pnpm --filter api dev
pnpm --filter web dev
pnpm db:migrate:deploy
```
