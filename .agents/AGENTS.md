# AGENTS.md

Current guidance for agents working in `C:\projects\advanced-javascript-org`.

This file is the durable project handoff. There are no separate agent plan files; inspect the current code and update this file when a change materially alters the documented state.

## Before Changing Code

- Inspect the relevant package scripts, shared contracts, feature files, and current diff before editing. The worktree is often dirty; preserve unrelated and user-owned changes.
- Read `docs/RUNBOOK.md` for local development, YDB, Docker, migrations, deployment, and troubleshooting.
- Never hand-edit generated directories such as `node_modules`, `.next`, `.source`, or package `dist` output.
- Never edit `pnpm-lock.yaml` manually. Let pnpm update it.
- Do not commit secrets or revert user changes unless explicitly asked.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant document in `apps/web/node_modules/next/dist/docs/`. The installed docs are the source of truth for this Next.js version.

<!-- END:nextjs-agent-rules -->

- Check the official Hono docs before Hono-specific work: https://hono.dev/docs/
- Check YDB v26.1 docs before every YDB implementation or planning step: https://ydb.tech/docs/en/?version=v26.1
- Check Fumadocs docs before Fumadocs-specific work: https://www.fumadocs.dev/

## Current State

As of 2026-08-16:

- The app is a JavaScript documentation and challenge-practice product. Product copy, routes, schemas, and APIs all use challenge naming. Do not introduce flashcard naming or `/flashcards` routes.
- The active challenge routes are `/challenges`, `/challenges/practice`, and `/challenges/review`.
- The challenge dashboard, endless practice player, wrong-answer review player, guest progress, Google OAuth gate, and restart flow are implemented.
- The dashboard intentionally does not render topic progress. The dashboard API still returns topic aggregates; do not restore the UI element unless the owner asks.
- YDB is the only database. Prisma/PostgreSQL code, dependencies, configuration, migrations, Docker services, and fallback behavior are removed.
- Shared Zod schemas in `packages/shared-types` are the contract source. Swagger/OpenAPI remains API-owned. There is no generated frontend API client and no duplicate `Practice*` contract module.
- The old todo/task product, custom email/password auth, roles, user blocking/status, difficulty, streaks, and answer-attempt history are intentionally absent.
- Shared-types build, API build, web production build, and scoped API/web lint pass after the current challenge-route and contract cleanup.
- Local YDB migration, seed, API practice flow, health behavior, and combined-container smoke were verified during the YDB migration. Real Google OAuth, guest-to-user merge, the latest combined Docker rebuild, and Yandex Cloud production deployment remain manual/external checks.

## Repository Shape

This is a pnpm 9/Turborepo monorepo:

- `apps/web`: Next.js 16, React 19, Fumadocs, Tailwind CSS, SWR, CodeMirror, and Sandpack.
- `apps/api`: Hono, `@hono/zod-openapi`, Google OAuth, YDB repositories, and Goose migrations.
- `packages/shared-types`: compiled shared Zod schemas and TypeScript types.
- `packages/eslint-config`: shared base and Next.js ESLint configurations.
- `challenges`: source drafts and seed payloads for reusable snippets and challenges.
- `infra`: local YDB Compose, combined/API-only Dockerfiles, and the combined runtime launcher.
- `docs/RUNBOOK.md`: operational source of truth.
- `.github/workflows/deploy-yc.yml`: combined-image deployment to Yandex Cloud Serverless Containers.

The root `README.md` is concise and recruiter-facing. Package READMEs describe their current package surfaces; keep historical implementation logs out of them.

## Commands

Run from the repository root unless stated otherwise:

```bash
pnpm install
pnpm dev
pnpm build
pnpm check
pnpm lint

pnpm db:up
pnpm db:down
pnpm db:migrate
pnpm db:status

pnpm seed
pnpm seed:challenges

pnpm docker:build
pnpm docker:run
pnpm docker:build-api
pnpm docker:run-api
```

Useful scoped verification:

```bash
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web types:check
pnpm --filter web build
```

Package `lint` scripts run TypeScript and ESLint with `--fix`; use direct `pnpm --filter <package> exec eslint <paths>` when a non-mutating scoped check is preferable.

## Web Application

Current routes and utilities:

- `/`: homepage.
- Root documentation pages such as `/array-methods`: generated from `apps/web/content/*.mdx` through the `(home)/[...slug]` route.
- `/challenges`: SWR-backed challenge dashboard with practice/review entry points, session totals, guest save-progress prompt, and required-auth gate.
- `/challenges/practice`: endless practice mode over unanswered challenges.
- `/challenges/review`: review mode over challenges whose current progress has `needsReview = true`.
- `/check-auth`: temporary/manual Google OAuth and `/api/me` verification utility.
- `/snippet-test`: rendering playground and older admin-authorized snippet/challenge seed UI.
- `/static-check-api`: diagnostic page.
- `/api/search`, `/og/[...slug]`, `/llms.mdx/[...slug]`, and `/sitemap.xml`: documentation/search/metadata routes.

Challenge UI implementation:

- `apps/web/src/app/challenges/page.tsx`: dashboard.
- `apps/web/src/app/challenges/_components/player.tsx`: shared practice/review player.
- `apps/web/src/app/challenges/practice/page.tsx` and `review/page.tsx`: fixed-mode route wrappers.
- `apps/web/src/api/challenges.ts`: typed challenge API boundary.
- `apps/web/src/lib/fetchers.ts`: shared `ky` helpers with credentials included.
- `apps/web/src/components/code-runner.tsx`: client-side runnable code editor/output.

Keep API calls behind typed wrappers in `apps/web/src/api`. The web app imports types from `@repo/shared-types`; do not generate a client from OpenAPI.

`apps/web/next.config.mjs` must keep the `/api/:path*` rewrite to `LOCAL_API_URL`. The combined container relies on that rewrite to reach the internal API.

Player behavior:

- Show the title, prompt, combined runnable code, exactly three answer options, and answered/total progress.
- Accept one answer per challenge presentation and lock the options afterward.
- A wrong answer reveals the correct option, displays feedback, and sets `needsReview = true`; there is no retry on the same presentation.
- A correct answer displays feedback and clears `needsReview`.
- `Next` fetches another challenge in the current mode.
- Practice exhaustion offers restart; review exhaustion links back to practice.
- Guests can dismiss the save-progress prompt until the 50-attempt required-auth gate.
- Google OAuth must start with browser navigation to `/api/auth/google`, not `fetch`.

Use the existing Fumadocs styling primitives and app tokens. Use `pnpm --filter web build` after routing or Next.js configuration changes.

## API

The API is mounted under `/api`. Core runtime files are `apps/api/src/app.ts`, `server.ts`, and `router.ts`. Feature modules use controller/service/repository/OpenAPI separation.

Public and optional-auth routes:

```text
GET  /api/healthz
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice|review
POST /api/challenges/:id/answer
POST /api/challenges/restart
GET  /api/guest-session
POST /api/guest-session
DELETE /api/guest-session
```

Google auth routes:

```text
GET /api/auth/google
GET /api/auth/google/callback
GET /api/me
```

Admin/content routes:

```text
POST   /api/admin/session
GET    /api/challenge-snippets
POST   /api/challenge-snippets
PATCH  /api/challenge-snippets/:id
DELETE /api/challenge-snippets/:id
GET    /api/challenges
POST   /api/challenges
PATCH  /api/challenges/:id
DELETE /api/challenges/:id
```

Swagger UI is `/api/swagger`; OpenAPI JSON is `/api/openapi.json` (with `/api/doc` retained as another document route).

API conventions:

- Google OAuth is the only user auth. Keep the `accessToken` cookie and bearer-token support; do not add local registration/login.
- Admin content management uses a separate 12-hour bearer token returned by `POST /api/admin/session` from `ADMIN_CODE`.
- Guest sessions are temporary anonymous progress buffers. On Google callback, merge guest progress into the user, delete/discard the guest session, clear its cookie, and set the user auth cookie.
- Challenge/snippet create and update payloads use `snippetId`; reusable code is not duplicated into every challenge.
- API services return `createHttpResult`/`HttpResult`/`SuccessHttpResult` values from `apps/api/src/shared/http.ts`.
- Controllers translate expected service failures into explicit JSON/status responses; do not throw for normal declared errors.
- `/api/healthz` queries YDB and returns `{ "status": "healthy", "db": "ok" }` or HTTP 503 with `{ "status": "unhealthy", "db": "fail" }`. API startup itself does not require an immediate successful DB query.

## Challenge Data And Progress

- `ChallengeSnippet` stores reusable `slug`, `topicSlug`, `title`, `language`, and code.
- `Challenge` stores one question and references a snippet through `snippetId`; multiple challenges may share a snippet. Challenge-specific `code` may be null.
- Every challenge has exactly three ordered options and exactly one correct option.
- Public runnable code is reusable snippet code first, followed by challenge-specific code when present.
- `ChallengeProgress` is current per-actor state, not an attempt log: `needsReview`, `answeredCount`, and `correctCount`.
- `answeredCount` is the internal attempt counter used for the 50-answer guest auth gate and guest/user merge math.
- Dashboard counts are card-state counts: `totalAnswered` is the number of challenges answered at least once; `totalCorrect` is answered challenges not currently needing review; `totalWrong`/`reviewCount` is the current review set; `practiceCount` is unanswered challenges.
- The dashboard API returns per-topic totals/completed/mastered aggregates even though the current dashboard UI does not render them.
- Restart deletes the current actor's progress rows and returns `resetCount`.
- Shared list pagination defaults to 5 and caps `limit` at 100.

## YDB And Migrations

- YDB is the only persistence backend. Database helpers live in `apps/api/src/lib/db.ts` and SQL/YQL helpers live beside their repositories.
- The single current Goose migration is `apps/api/db/migrations/20260801135000_00001_create_initial_schema.sql`.
- Current tables are `users`, `oauth_accounts`, `guest_sessions`, `challenge_snippets`, `challenges`, `challenge_options`, `user_challenge_progress`, and `guest_challenge_progress`.
- Use snake_case database names and explicit `*_id` relation columns. Repository code enforces referential behavior/cascades that YDB does not provide automatically.
- Use YDB unique secondary indexes for uniqueness.
- Do not edit an already-applied migration. Add a new migration and apply it before code that expects the new schema.
- List endpoints sort user-facing text case-insensitively with whitelisted `Unicode::ToLower(...)` expressions before passing expressions to `unsafe(...)`.
- Explicit local hosts (`localhost`, `127.0.0.1`, `host.docker.internal`) disable YDB endpoint discovery so local/Docker connections do not redirect to container loopback.

Local services:

- Compose file: `infra/db.compose.yml`.
- Container: `repo-db-local`.
- gRPC: `localhost:2136`.
- YDB UI: `http://localhost:9876` (host `9876` maps to container `8765`).
- App connection: `grpc://localhost:2136/local`.
- Goose connection: `grpc://localhost:2136/local?go_query_mode=scripting&go_fake_tx=scripting&go_query_bind=declare,numeric`.
- DataGrip/JDBC: `jdbc:ydb:grpc://127.0.0.1:2136/local` with anonymous/no-auth; do not append Goose query parameters.

Keep API environment in `apps/api/.env` for local development. Production migration credentials belong in the uncommitted `apps/api/.env.production.local`; `scripts/goose-prod.mjs` obtains a short-lived Yandex IAM token.

## Challenge Content And Seeding

- `challenges/snippets.md`: aggregate manual working source derived from documentation content.
- `challenges/*.md`: per-snippet/manual challenge drafts. The current Markdown set contains 85 `### Challenge` sections.
- `challenges/seed-snippets.ts`: reusable snippet create payload consumed by `pnpm seed`.
- `challenges/saved-snippets.ts`: persisted snippet UUIDs referenced by challenge seed objects.
- `challenges/separate-challenges/*.ts`: 85 one-challenge-per-file seed modules consumed by `pnpm seed:challenges`.
- `apps/web/src/app/snippet-test/seed-challenges.ts`: older web seed payload for the temporary playground.

Seed rules:

- Run `pnpm seed` before `pnpm seed:challenges`.
- Seed commands validate through shared Zod schemas, create missing rows, skip duplicate slugs, and fail if other errors remain.
- Separate challenge modules intentionally do not import shared types.
- Each challenge seed uses the persisted `snippetId`, includes only challenge-specific code or null, has exactly three options, exactly one correct answer, and varied correct-option positions.
- Answer labels are visible `console.log` outputs/results for the current UI.

## Docker And Deployment

- `infra/Dockerfile` builds the shared package, API, and standalone Next.js app, then runs both processes in one container through `infra/start.mjs`.
- Next.js is public on `PORT` (`8080` in Yandex Cloud; root `pnpm docker:run` overrides it to `3000`).
- Hono is internal on `API_PORT=8081`; `LOCAL_API_URL=http://127.0.0.1:8081` feeds the Next.js rewrite.
- YDB remains external. Local combined-container access uses `grpc://host.docker.internal:2136/local`; production uses metadata credentials and the configured YDB connection.
- `infra/api.Dockerfile` is retained for API-only local/debug builds.
- `.github/workflows/deploy-yc.yml` builds and pushes the combined image on relevant `main` changes and deploys a Yandex Cloud Serverless Container revision.
- Apply production migrations separately before deploying code that requires them.

## Safety And Scope

- Preserve the challenge namespace across UI, routes, APIs, shared types, docs, and database concepts.
- Do not reintroduce Prisma, PostgreSQL, generated API clients, `Practice*` duplicate contracts, or legacy database fallbacks.
- Do not add todos/tasks, local passwords, roles/admin user models, user blocking/status, difficulty, streaks, or answer-attempt history without an explicit product decision.
- Keep the existing `db:*` command set; do not re-add the removed `db:logs` helper.
- Keep changes package-scoped and verify them with the owning package's commands.
