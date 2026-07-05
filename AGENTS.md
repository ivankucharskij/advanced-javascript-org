# AGENTS.md

Guidance for agents working in `C:\projects\advanced-javascript-org`.

## Project Shape

This is a pnpm/Turborepo monorepo with:

- `apps/web`: Next.js 16, React 19, Fumadocs docs site.
- `apps/api`: Hono API with Prisma/PostgreSQL.
- `packages/shared-types`: compiled shared Zod schemas and inferred types.
- `infra`: Dockerfiles and local Postgres compose file.

The root `README.md` is the operational runbook. Read it first for local dev, Docker, migrations, deploy, and CI/CD.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

https://hono.dev/docs/

https://www.fumadocs.dev/

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
- `snippets.md` is the manual working draft for reusable JavaScript snippet content derived from `apps/web/content/*.mdx`.
- Generated folders like `.next`, `.source`, `node_modules`, and Prisma generated output should not be hand-edited.
- Product UX is JavaScript flashcard practice, but backend/schema naming intentionally keeps `Challenge*`.
- Do not reintroduce todos/tasks, custom email/password auth, admin/roles, user status/blocking, difficulty, or answer-attempt history.
- `ChallengeSnippet` stores reusable code snippets. `Challenge` stores one question for a snippet through `snippetId`; multiple challenges may point at the same snippet.
- `ChallengeProgress` is the per-user/per-guest card state: `needsReview`, `answeredCount`, and `correctCount`.

## Web Notes

- Root docs pages are served from `apps/web/content/*.mdx`.
- Homepage is `apps/web/src/app/(home)/page.tsx`.
- Flashcard UI should live under `/flashcards` routes. Existing challenge UI code may be transitional and should be adapted, not expanded as a separate product.
- `/snippet-test` is a temporary rendering playground for one snippet/question. Keep experiments there until the real flashcard UI exists.
- Use Fumadocs code rendering primitives already used by the app, such as `fumadocs-ui/components/dynamic-codeblock`, for snippet code styling.
- Client HTTP helpers live in `apps/web/src/lib/fetchers.ts`; use the shared `fetchers` object for web API calls.
- Use `pnpm --filter web build` after routing or Next config changes.

## API Notes

- API env lives in `apps/api/.env` for local dev.
- Health endpoint is `/api/healthz`.
- Auth is Google OAuth only. Keep `/api/me`, `/api/auth/google`, and `/api/auth/google/callback`; do not add local register/login.
- `/check-auth` is the temporary web auth verification page. Keep auth-related manual checks there until the real `/login` and `/flashcards` flows replace it.
- Flashcard APIs use `/api/challenges/*` and `Challenge*` contracts.
- Snippet APIs use `/api/challenge-snippets/*` and `ChallengeSnippet*` contracts. Snippet CRUD follows the same controller/service/repository/OpenAPI structure as challenges.
- Challenge create/update payloads should use `snippetId`, not inline snippet code.
- Guest sessions are temporary anonymous progress buffers. On Google login, merge current guest progress into `User` and discard the guest session.
- Shared API HTTP helpers live in `apps/api/src/shared/http.ts`.
- API services should return shared HTTP helper result types (`createHttpResult`, `HttpResult`, `SuccessHttpResult`) rather than ad hoc objects.
- API controllers should translate service results into explicit JSON responses. Do not `throw new Error(result.message)` for normal service-result handling; return `c.json({ message }, status)` for declared error responses.
- API startup checks DB connectivity.
- Run migrations before starting code that expects new schema.

## Safety

- Do not commit secrets.
- Do not revert user changes unless explicitly asked.
- Keep edits scoped; this repo often has a dirty working tree.
- Never edit `pnpm-lock.yaml` manually. Only let pnpm update lockfiles through pnpm commands.
