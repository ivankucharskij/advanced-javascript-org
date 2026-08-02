# Flashcards Product Plan

Build this as the main portfolio product: a Google-auth-backed JavaScript flashcard practice app using existing course topics/content. The old todo/task domain is disposable and should stay removed.

## Current Status

The `apps/api` migration from Prisma/PostgreSQL to YDB is locally verified. The repo no longer has active Prisma/PostgreSQL code, dependencies, scripts, env, Docker services, or future-facing docs.

Current handoff:

- Stop point: 2026-08-02 after local automated YDB final verification,
  Docker smoke checks, app-level database naming cleanup, command-line
  reusable snippet seeding, and YDB text-sort cleanup.
- Resume from: owner review. External Google OAuth and Yandex Cloud production checks remain owner-context tasks if the owner wants them.
- No next agent implementation step is queued. When work resumes, read `.agents/AGENTS.md`, `.agents/plan.md`, `.agents/plan-steps.md`, package scripts, shared contracts, and the files involved in the requested change before editing.
- Do not continue into unrelated product work until the owner accepts the YDB migration state or explicitly asks to resume product work.

Confirmed migration decisions:

- Use `apps/api` as the API path.
- Before every YDB-related implementation or planning step, consult YDB v26.1 docs: https://ydb.tech/docs/en/?version=v26.1
- Use snake_case table and column names.
- Use YDB unique secondary indexes instead of lookup tables for uniqueness.
- Make `challenge_order` required at the application/API/seed level.
- Keep admin `q` search simple and scan-based for the first YDB slice.
- Model relations explicitly with `*_id` columns, for example `challenges.snippet_id -> challenge_snippets.id`. YDB stores those IDs, while repository code enforces referential rules and cascades.
- Keep the user's removal of `db:logs`; do not re-add it.
- No legacy database fallback is wanted. YDB is the active persistence backend.
- App-owned database names are generic `db`, because YDB is the only supported
  database. Use `DB_CONNECTION_STRING`, `apps/api/src/lib/db.ts`,
  `apps/api/db/migrations`, `infra/db.compose.yml`, and root `db:*` scripts.

Current local YDB state:

- `infra/db.compose.yml` exists and starts `repo-db-local`.
- Local YDB gRPC is reachable on `localhost:2136` / `127.0.0.1:2136`.
- YDB UI should be available at `http://localhost:9876`.
- Goose connects through `GOOSE_DBSTRING`.
- Applied schema version: `20260801135000`.

Important connection strings:

```env
DB_CONNECTION_STRING=grpc://localhost:2136/local
GOOSE_DBSTRING=grpc://localhost:2136/local?go_query_mode=scripting&go_fake_tx=scripting&go_query_bind=declare,numeric
GOOSE_MIGRATION_DIR=apps/api/db/migrations
GOOSE_TABLE=goose_db_version
```

For JetBrains/DataGrip YDB JDBC, use anonymous/no-auth and:

```text
jdbc:ydb:grpc://127.0.0.1:2136/local
```

Do not use Goose query params in the JDBC URL.

Verified YDB commands:

```bash
pnpm.cmd db:status
pnpm.cmd db:migrate
goose -env apps/api/.env -dir apps/api/db/migrations down
pnpm.cmd db:migrate
pnpm.cmd --filter api build
pnpm.cmd check
pnpm.cmd seed
```

Latest verification results:

- `pnpm.cmd check` passes after app-level database naming cleanup.
- `pnpm.cmd --filter api lint` passes after app-level database naming cleanup and the YDB text-sort cleanup.
- `pnpm.cmd db:status` shows `20260801135000_00001_create_initial_schema.sql` applied.
- `pnpm.cmd --filter api build` passes.
- `pnpm.cmd check` passes after Prisma/PostgreSQL runtime removal.
- `pnpm.cmd check` passes after YDB-only docs/deployment updates.
- `pnpm.cmd seed` passes through the YDB-only seed workflow and seeds reusable challenge snippets from `challenges/seed-snippets.ts`, skipping existing slugs.
- `/api/challenge-snippets?page=1&limit=5&sortBy=title&sortDirection=desc`
  returns human-descending title order after switching YDB text sort
  expressions to `Unicode::ToLower(...)`.
- Future-facing README/runbook/API/infra docs and active deployment docs no longer mention Prisma/PostgreSQL, Neon, or `DATABASE_URL`.
- `pnpm.cmd docker:build` passes after removing Prisma generation/copy layers.
- Combined Docker image smoke passes against local YDB through `DB_CONNECTION_STRING=grpc://host.docker.internal:2136/local`.
- Container public health route `http://localhost:3100/api/healthz` returns `{ "status": "healthy" }`.
- Disposable API smoke created a snippet/challenge, answered wrong as a guest, saw the card in review, restarted progress, and deleted the disposable rows.
- `pnpm.cmd lint` passes with one existing warning in `apps/web/src/components/code-runner.tsx` about `react-hooks/set-state-in-effect`.
- The previous migration was rolled back and the corrected migration was re-applied successfully.
- After the naming cleanup, the old `repo-ydb-local` container was removed and
  the renamed `repo-db-local` compose service was verified. YDB UI uses host
  port `9876` mapped to container port `8765` because Windows excluded the
  earlier host ports.

Files currently involved in the YDB migration work:

- `apps/api/db/migrations/20260801135000_00001_create_initial_schema.sql`
- `.agents/plan.md`
- `.agents/plan-steps.md`
- `.agents/AGENTS.md`
- `apps/api/.env.example`
- `apps/api/env.d.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/lib/db.ts`
- `apps/api/src/lib/db-utils.ts`
- `apps/api/src/shared/cookies.ts`
- `apps/api/src/features/auth/auth.controller.ts`
- `apps/api/src/features/auth/auth.repository.ts`
- `apps/api/src/features/auth/auth.service.ts`
- `apps/api/src/features/guest-sessions/guest-sessions.controller.ts`
- `apps/api/src/features/guest-sessions/guest-sessions.repository.ts`
- `apps/api/src/features/challenge-snippets/challenge-snippets.repository.ts`
- `apps/api/src/features/challenge-snippets/challenge-snippets.sql.ts`
- `apps/api/src/features/challenges/challenges.repository.ts`
- `apps/api/src/features/challenges/challenges.sql.ts`
- `apps/api/src/scripts/seed.ts`
- `challenges/seed-snippets.ts`
- `packages/shared-types/src/features/challenges/challenges.schemas.ts`
- `apps/api/src/server.ts`
- `apps/api/package.json`
- `pnpm-lock.yaml`
- `package.json`
- `turbo.json`
- `infra/db.compose.yml`
- `infra/Dockerfile`
- `infra/api.Dockerfile`
- `.github/workflows/deploy-yc.yml`
- `README.md`
- `apps/api/README.md`
- `docs/RUNBOOK.md`
- `infra/README.md`

Known dirty worktree note:

- The repo already has uncommitted changes. Do not revert user changes.
- `infra/db.compose.yml` was already present as untracked user work when the YDB migration task began.
- `package.json` has user removal of `db:logs`; preserve it.

Current facts:

- Active runtime DB access is YDB through `apps/api/src/lib/db.ts`.
- Prisma runtime dependencies, generated client files, Prisma config, Prisma schema/migrations, and the local Postgres compose file have been removed.
- Future-facing docs describe YDB/Goose as the active database/migration stack.
- Local YDB compose support exists at `infra/db.compose.yml`.
- The old local Postgres orphan container `repo-prisma-postgres` was removed during final verification.
- The YDB JS driver disables endpoint discovery for explicit local hosts (`localhost`, `127.0.0.1`, `host.docker.internal`) so Docker local connections do not follow YDB local discovery back to container loopback.
- YDB `ORDER BY` supports expressions; user-facing text sort fields use `Unicode::ToLower(...)` so lowercase titles such as `thisArg...` do not sort ahead of uppercase titles in descending order.
- Auth and guest cookies use secure cookies when `WEB_ORIGIN` is HTTPS; this preserves production HTTPS behavior while allowing HTTP localhost Docker smoke tests.
- Goose supports the `ydb` driver and can read `GOOSE_DRIVER`, `GOOSE_DBSTRING`, `GOOSE_MIGRATION_DIR`, and `GOOSE_TABLE` from env files.
- YDB local Goose connection string should use:

```text
grpc://localhost:2136/local?go_query_mode=scripting&go_fake_tx=scripting&go_query_bind=declare,numeric
```

- Prisma ORM does not list YDB as a supported database, so this is not a provider swap. The API persistence layer must move away from Prisma.

References:

- YDB docs v26.1: https://ydb.tech/docs/en/?version=v26.1
- YDB Goose integration: https://ydb.tech/docs/en/integrations/migration/goose?version=v26.1
- Goose env vars: https://pressly.github.io/goose/documentation/environment-variables/
- Goose YDB driver example: https://github.com/pressly/goose
- YDB JS SDK: https://ydb.js.org/guide/core
- Prisma supported databases: https://docs.prisma.io/docs/orm/reference/supported-databases

## Product Shape

- Main experience is an endless flashcard practice flow, not a challenge list.
- Content target is roughly 250-300 JavaScript flashcards.
- Each flashcard has:
  - reusable snippet code from `ChallengeSnippet`
  - challenge-specific code that should be appended after the snippet code when present
  - instruction/prompt text for future UI use
  - 3 answer options
  - one correct option
  - feedback/explanation
- For the MVP, answer labels should be console output/results because the frontend does not display the prompt yet.
- User answers once per card presentation.
- If the answer is wrong:
  - show the correct answer immediately
  - show feedback/explanation
  - set `needsReview = true`
  - continue to the next card
  - do not let the user keep selecting options until they get it right in that same presentation
- No difficulty field. Difficulty is unknown and should not be guessed.
- No streaks.
- No admin UI.
- No custom email/password auth.
- Users can start practicing without auth.
- After 50 answered flashcards, require Google auth.
- Guest progress is temporary. On Google login, merge the current guest progress into the authenticated account, then destroy/discard the guest session.

## Contract And Frontend Data

- Stop generating frontend API types from OpenAPI.
- `packages/shared-types` is the shared schema/type package.
- Use shared Zod schemas and inferred TypeScript types from `packages/shared-types`.
- Use `tsdown` to build `packages/shared-types`.
- Keep Swagger/OpenAPI inside `apps/api`.
- Use SWR in `apps/web` for the current implementation.
- Keep frontend API requests in one place under `apps/web/src/api`.
- Keep the typed API wrapper boundary if the data-fetching library changes later.

Target shape:

```text
packages/shared-types  shared Zod schemas and inferred types
apps/api               imports schemas, exposes Swagger/OpenAPI
apps/web/src/api       typed API wrappers used by SWR/fetchers
```

## Auth

Use Google OAuth only. There is no app-native registration/login form.

Google routes:

```text
GET /api/auth/google
GET /api/auth/google/callback
GET /api/me
```

Flow:

1. User practices as a guest.
2. Guest progress is saved under a single guest session cookie.
3. After 50 answered flashcards, UI requires auth.
4. User clicks "Continue with Google".
5. Hono Google middleware handles redirect/callback.
6. API receives Google profile.
7. Find or create internal `User`.
8. Link Google identity in `OAuthAccount`.
9. Merge current `GuestSession` progress into the `User`.
10. Delete/discard the guest session and clear the guest cookie.
11. Set `accessToken` cookie.
12. Return the typed auth response. The web app decides where to navigate next.

Required env:

```text
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
```

## API

Public/optional-auth:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice
GET  /api/challenges/next?mode=review
POST /api/challenges/:id/answer
POST /api/challenges/restart
```

Auth:

```text
GET /api/me
GET /api/auth/google
GET /api/auth/google/callback
```

Content management through Swagger, no admin UI for now:

```text
GET    /api/challenge-snippets
POST   /api/challenge-snippets
PATCH  /api/challenge-snippets/:id
DELETE /api/challenge-snippets/:id
GET    /api/challenges
POST   /api/challenges
PATCH  /api/challenges/:id
DELETE /api/challenges/:id
```

Swagger/OpenAPI are served under `/api/swagger` and `/api/openapi.json`.

## Content Drafts

- `challenges/snippets.md` remains the source working draft extracted from `apps/web/content/*.mdx`.
- `challenges/*.md` contains one file per snippet, named by snippet slug. Each file preserves the snippet metadata/code and appends one to four challenge drafts.
- `challenges/seed-snippets.ts` contains the API create-shape reusable snippet seed payload used by `pnpm seed`.
- Challenge draft answers should be visible `console.log` outputs/results.
- A challenge's runnable code should start with the reusable snippet, then append challenge-specific code second.

## Legacy Prisma Shape

This section records the product data model that currently exists in legacy Prisma form. The active database target is YDB, and `.agents/plan-steps.md` defines the ordered Prisma/PostgreSQL removal path.

Remove old todo tables:

```prisma
model Task
enum Priority
enum Status
```

Do not model:

```text
password
role/admin
status/blocking
difficulty
permanent guest-session ownership by user
```

Target product schema keeps `Challenge*` database/API naming. In product copy and UI, a challenge is presented as a flashcard.

```prisma
model User {
  id        String   @id @default(uuid())
  fullName  String
  email     String   @unique
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  oauthAccounts     OAuthAccount[]
  challengeProgress ChallengeProgress[]
}

model OAuthAccount {
  id                String   @id @default(uuid())
  userId            String
  provider          String
  providerAccountId String
  email             String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@index([email])
}

model GuestSession {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  challengeProgress ChallengeProgress[]
}

model Challenge {
  id        String   @id @default(uuid())
  slug      String   @unique
  topicSlug String
  title     String
  prompt    String
  code      String
  order     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  options  ChallengeOption[]
  progress ChallengeProgress[]

  @@index([topicSlug, order])
}

model ChallengeOption {
  id          String  @id @default(uuid())
  challengeId String
  label       String
  isCorrect   Boolean
  feedback    String
  order       Int

  challenge Challenge @relation(fields: [challengeId], references: [id])

  @@index([challengeId, order])
}

model ChallengeProgress {
  id             String   @id @default(uuid())
  userId         String?
  guestSessionId String?
  challengeId    String
  needsReview    Boolean  @default(false)
  answeredCount  Int      @default(0)
  correctCount   Int      @default(0)

  user         User?         @relation(fields: [userId], references: [id])
  guestSession GuestSession? @relation(fields: [guestSessionId], references: [id])
  challenge    Challenge     @relation(fields: [challengeId], references: [id])

  @@unique([userId, challengeId])
  @@unique([guestSessionId, challengeId])
  @@index([userId, needsReview])
  @@index([guestSessionId, needsReview])
}
```

Keep `Challenge*` names in code and database. Use "flashcard" in user-facing copy where it better describes the experience.

## UI Routes

```text
/challenges          current combined practice/review UI
/flashcards          future dashboard / entry point
/flashcards/practice future endless practice flow
/flashcards/review   future wrong-card review flow
/login               Google login
/check-auth          temporary manual auth verification page
```

Also add a dismissible auth prompt:

- Show Google auth prompt only for guests.
- Authenticated users should not see this prompt.
- User can dismiss it until the 50-answer gate.
- Do not do background/silent Google authorization.
- OAuth redirect happens only after the user clicks Google or reaches the auth gate.

## Completed Product Implementation Slice

1. Shared schemas + SWR/fetcher direction.
2. Replace Prisma schema with the flashcard product schema.
3. Create destructive dev migration.
4. Remove old todo API surface.
5. Replace old users/email-password feature with Google-only auth and `/api/me`.
6. Add Swagger endpoints to create/manage challenges/flashcards.
7. Implement public/optional-auth challenge API with guest progress.
8. Implement endless practice and wrong-card review UI. Current transitional UI is `/challenges`.
9. Add auth gate after 50 answered flashcards.

## Portfolio Value

Shows real product architecture: Google OAuth, guest-to-user progress merge, custom auth cookies, YDB-backed persistence, shared Zod contracts, typed frontend fetchers, Swagger-managed content, optional/protected APIs, wrong-card review, saved progress, Docker, CI/CD, and polished educational UX.
