# AGENTS.md

Guidance for agents working in `C:\projects\advanced-javascript-org`.

## First Actions

- Before starting implementation work, look around the repo carefully. Read the relevant `.agents` files, current plan files, shared contracts, package scripts, and the feature files involved in the requested change.
- Treat `.agents/plan.md` and `.agents/plan-steps.md` as the planning source of truth. Do not create separate ad hoc plan files unless the owner explicitly asks.
- The YDB migration for `apps/api` is locally verified. Do not reintroduce legacy database code, scripts, env, Docker services, or docs.
- Before every YDB-related implementation or planning step, check the YDB v26.1 docs: https://ydb.tech/docs/en/?version=v26.1
- Do not add legacy database fallback behavior. YDB is the active persistence backend.

## Project Shape

This is a pnpm/Turborepo monorepo with:

- `apps/web`: Next.js 16, React 19, Fumadocs docs site.
- `apps/api`: Hono API with YDB persistence.
- `packages/shared-types`: compiled shared Zod schemas and inferred types.
- `infra`: Dockerfiles and local YDB compose support.

The root `README.md` is recruiter-facing. Read `docs/RUNBOOK.md` first for local dev, Docker, migrations, deploy, and CI/CD.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

Check hono docs when working with hono
https://hono.dev/docs/

Check YDB v26.1 docs when working with YDB
https://ydb.tech/docs/en/?version=v26.1

Check fumadocs when working with fumadocs
https://www.fumadocs.dev/

## Common Commands

Run from the repo root unless noted otherwise:

```bash
pnpm install
pnpm dev
pnpm check
pnpm --filter web build
pnpm --filter api build
pnpm db:up
pnpm db:migrate
pnpm db:status
pnpm seed
pnpm docker:build
pnpm docker:run
```

## Important Conventions

- YDB is the active database.
- Local YDB uses `infra/db.compose.yml`; do not re-add removed helper scripts such as `db:logs`.
- YDB list endpoints should sort user-facing text fields case-insensitively with `Unicode::ToLower(...)` in `ORDER BY` expressions. Keep sort fields whitelisted before passing expressions through `unsafe(...)`.
- `pnpm docker:run` serves the combined app at `http://localhost:3000`; temporary smoke tests may use another host port if `3000` is busy.
- The combined Docker image runs Next.js publicly and the API internally.
- `apps/web/next.config.mjs` must keep the `/api/:path*` rewrite.
- Fumadocs content lives in `apps/web/content`.
- `challenges/snippets.md` is the manual working draft for reusable JavaScript snippet content derived from `apps/web/content/*.mdx`.
- `challenges/*.md` contains one Markdown draft per snippet, named by snippet slug. Each file should preserve the snippet section from `challenges/snippets.md` and append one to four console-output challenge drafts.
- `challenges/seed-snippets.ts` contains the API create-shape reusable snippet seed payload used by `pnpm seed`.
- `challenges/saved-snippets.ts` stores the current persisted snippet IDs used by generated challenge seed data.
- `challenges/separate-challenges/*.ts` contains one generated challenge object per challenge draft. These files intentionally do not import shared types. Each object should use `snippetId` from `saved-snippets.ts`, include only challenge-specific `code` or `null`, have exactly three options, exactly one correct option, and avoid putting the correct answer in the same position every time.
- Generated folders like `.next`, `.source`, and `node_modules` should not be hand-edited.
- Product UX is JavaScript flashcard practice, but backend/schema naming intentionally keeps `Challenge*`.
- Do not reintroduce todos/tasks, custom email/password auth, admin/roles, user status/blocking, difficulty, or answer-attempt history.
- `ChallengeSnippet` stores reusable code snippets. `Challenge` stores one question for a snippet through `snippetId`; multiple challenges may point at the same snippet.
- `ChallengeProgress` is the per-user/per-guest card state: `needsReview`, `answeredCount`, and `correctCount`.
- Dashboard totals are current card-state counts: `totalAnswered` is answered cards, `totalCorrect` is answered cards not currently needing review, and `totalWrong` is current review cards. Keep `answeredCount` as an internal attempt counter for auth gating and merge math.
- Shared pagination query validation caps `limit` at 100.

## Web Notes

- Root docs pages are served from `apps/web/content/*.mdx`.
- Homepage is `apps/web/src/app/(home)/page.tsx`.
- Current practice UI is under `/challenges` and is transitional. Future route cleanup may move it under `/flashcards`; adapt the existing UI rather than expanding a separate product.
- `/snippet-test` is a temporary rendering playground for one snippet/question. Keep experiments there until the real flashcard UI exists.
- `/snippet-test` also has temporary admin seed buttons. `pnpm seed` seeds reusable snippets from `challenges/seed-snippets.ts`; the temporary UI can still seed challenges from `seed-challenges.ts`, and challenge seeding depends on matching persisted `snippetId` values.
- Use Fumadocs code rendering primitives already used by the app, such as `fumadocs-ui/components/dynamic-codeblock`, for snippet code styling.
- Client HTTP helpers live in `apps/web/src/lib/fetchers.ts`; use the shared `fetchers` object for web API calls.
- Use `pnpm --filter web build` after routing or Next config changes.

## API Notes

- API env lives in `apps/api/.env` for local dev.
- Health endpoint is `/api/healthz`.
- Swagger UI is `/api/swagger`; OpenAPI JSON is `/api/openapi.json`.
- Auth is Google OAuth only. Keep `/api/me`, `/api/auth/google`, and `/api/auth/google/callback`; do not add local register/login.
- `/check-auth` is the temporary web auth verification page. Keep auth-related manual checks there until the real `/login` and `/flashcards` flows replace it.
- Flashcard APIs use `/api/challenges/*` and `Challenge*` contracts.
- Public flashcard flow endpoints are `/api/challenges/dashboard`, `/api/challenges/next?mode=practice|review`, `/api/challenges/:id/answer`, and `/api/challenges/restart`.
- Snippet APIs use `/api/challenge-snippets/*` and `ChallengeSnippet*` contracts. Snippet CRUD follows the same controller/service/repository/OpenAPI structure as challenges.
- Current YDB text sorting fix is in `apps/api/src/features/challenge-snippets/challenge-snippets.sql.ts` and `apps/api/src/features/challenges/challenges.sql.ts`.
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
