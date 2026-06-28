# AGENTS.md

Guidance for agents working in `C:\projects\advanced-javascript-org`.

## Project Shape

This is a pnpm/Turborepo monorepo with:

- `apps/web`: Next.js 16, React 19, Fumadocs docs site.
- `apps/api`: Hono API with Prisma/PostgreSQL.
- `packages/shared-types`: compiled shared Zod schemas and inferred types.
- `infra`: Dockerfiles and local Postgres compose file.

The root `README.md` is the operational runbook. Read it first for local dev, Docker, migrations, deploy, and CI/CD.

## Common Commands

Run from the repo root unless noted otherwise:

```bash
pnpm install
pnpm dev
pnpm --filter web build
pnpm --filter api build
pnpm db:migrate:dev
pnpm db:migrate:deploy
pnpm db:up
pnpm docker:build
pnpm docker:run
```

## Important Conventions

- Local DB is Docker Compose Postgres from `infra/postgres.compose.yaml`.
- Production DB is Neon; use `pnpm db:migrate:deploy`, never `migrate dev`.
- The combined Docker image runs Next.js publicly and the API internally.
- `apps/web/next.config.mjs` must keep the `/api/:path*` rewrite.
- Fumadocs content lives in `apps/web/content`.
- Generated folders like `.next`, `.source`, `node_modules`, and Prisma generated output should not be hand-edited.

## Web Notes

- Root docs pages are served from `apps/web/content/*.mdx`.
- Homepage is `apps/web/src/app/(home)/page.tsx`.
- Quiz/challenge UI starts at `apps/web/src/app/challenges/page.tsx`.
- Use `pnpm --filter web build` after routing or Next config changes.

## API Notes

- API env lives in `apps/api/.env` for local dev.
- Health endpoint is `/api/healthz`.
- API startup checks DB connectivity.
- Run migrations before starting code that expects new schema.

## Safety

- Do not commit secrets.
- Do not revert user changes unless explicitly asked.
- Keep edits scoped; this repo often has a dirty working tree.
