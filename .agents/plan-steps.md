# Step-by-Step Implementation Plan

Work one step at a time. After each step, stop, test, and record the result before moving on.

## Current Status: YDB Migration Locally Verified

The `apps/api` migration from Prisma/PostgreSQL to YDB is locally verified. No next YDB implementation step is queued. Resume from owner review, external Google OAuth/Yandex Cloud checks if requested, or explicit owner direction to continue product work.

Before every YDB-related step, check the YDB v26.1 docs: https://ydb.tech/docs/en/?version=v26.1

### YDB Step 1: Confirm Target Architecture

Decide the final persistence stack before touching code:

- Use YDB as the only API database.
- Replace Prisma Client with a YDB repository/data-access layer.
- Replace Prisma migrations with Goose SQL/YQL migrations.
- Keep existing HTTP API contracts and shared Zod schemas unchanged unless YDB forces a behavior change.
- Keep Postgres/Prisma files only as temporary migration source/reference until YDB parity is proven, then remove them completely.

Checkpoint:

- Owner confirms this is a full migration away from Prisma, not a dual-database runtime.

Result:

- Confirmed by owner on 2026-08-01. Proceeding with YDB as the target persistence backend. Prisma/PostgreSQL may remain only as temporary migration source/reference during the port and must be removed after YDB parity.

### YDB Step 2: Normalize YDB Env And Tooling

Add the local/dev operational pieces:

- Decide the YDB migration directory, likely `apps/api/db/migrations`.
- Update `GOOSE_MIGRATION_DIR` to match the chosen directory.
- Add root package scripts for YDB:
  - `db:up`
  - `db:down`
  - `db:migrate`
  - `db:status`
- Register any new env keys in `turbo.json`.
- Extend `apps/api/env.d.ts` and `apps/api/src/config/env.ts` for YDB runtime env.
- Keep `DATABASE_URL` until Prisma is removed.

Checkpoint:

- `docker compose -f infra/db.compose.yml up -d` starts local YDB.
- YDB UI opens at `http://localhost:9876`.
- `goose status` can connect to local YDB and find the migration directory.

Result:

- Added root YDB scripts: `db:up`, `db:down`, `db:migrate`, and `db:status`.
- Set `DB_CONNECTION_STRING=grpc://localhost:2136/local` for app runtime.
- Set `GOOSE_DBSTRING` to the YDB Goose migration connection string with `go_query_mode`, `go_fake_tx`, and `go_query_bind`.
- Set `GOOSE_MIGRATION_DIR=apps/api/db/migrations`.
- Added optional `DB_CONNECTION_STRING` typing and validation without making it required while Prisma was still active.
- Added tracked migration directory at `apps/api/db/migrations`.
- Verified `package.json` and `turbo.json` parse as JSON.
- Verified `pnpm.cmd --filter api build` passes.
- Verified Goose is installed: `goose version: v3.27.3`.
- Verified `pnpm.cmd db:up` starts local YDB; Docker reported existing Postgres as an orphan but it was not removed.
- Verified YDB connection with `goose -env apps/api/.env -dir apps/api/db/migrations version`, which returned version `0`.
- `pnpm.cmd db:status` stopped with `no migration files found`, which was expected before Step 4 created the first migration.

### YDB Step 3: Design The YDB Schema

Translate the Prisma data model into explicit YQL tables:

- `users`
- `oauth_accounts`
- `guest_sessions`
- `challenge_snippets`
- `challenges`
- `challenge_options`
- `user_challenge_progress`
- `guest_challenge_progress`

Decisions made during this step:

- Use UUID strings generated in TypeScript for IDs.
- Use YDB `Utf8` for text IDs/slugs/content.
- Use YDB `Timestamp` for timestamps.
- Replace Prisma `@updatedAt` with application-managed `updatedAt`.
- Replace Prisma relation/cascade behavior with repository-level writes and deletes.
- Replace Prisma `@unique` and `@@index` with YDB primary keys and secondary or unique secondary indexes.
- Replace Prisma `Challenge.order @default(autoincrement())` with required application-assigned `challenge_order Int32`.
- Keep admin search (`q` contains title/prompt/code) as an application-level scan for the first YDB slice.
- Use snake_case table and column names.

Checkpoint:

- Owner reviews the proposed YDB table definitions before the first migration is created.

Result:

- Proposed and reviewed a YDB-native schema that preserves the external API contract while avoiding Prisma-specific relational behavior.
- User confirmed the open decisions on 2026-08-01.
- No Goose migration was created in Step 3.

Repository mapping notes:

- `authRepository.findUserById` reads `users` by primary key.
- `authRepository.upsertGoogleUser` uses `users_email_unique` and `oauth_accounts` in one YDB transaction.
- `guestSessionsRepository.find/findOrCreate/discard` uses `guest_sessions` and `guest_challenge_progress`.
- `guestSessionsRepository.mergeIntoUser` reads guest progress by `guest_session_id`, upserts into `user_challenge_progress`, then deletes guest progress/session.
- `challengeSnippetsRepository.findBySlug` uses `challenge_snippets_slug_unique`.
- `challengeSnippetsRepository.delete` checks `challenges_by_snippet` before deleting the snippet row.
- `challengesRepository.findBySlug` uses `challenges_slug_unique`.
- `challengesRepository.next(practice)` reads ordered challenges and skips rows that exist in the actor progress table.
- `challengesRepository.next(review)` reads the actor progress review index, then loads the first matching challenge.
- `challengesRepository.dashboard` counts challenges, groups topics from `challenges`, and summarizes the actor progress table.

Relationship columns:

- `oauth_accounts.user_id` references `users.id`.
- `challenges.snippet_id` references `challenge_snippets.id`.
- `challenge_options.challenge_id` references `challenges.id`.
- `user_challenge_progress.user_id` references `users.id`.
- `user_challenge_progress.challenge_id` references `challenges.id`.
- `guest_challenge_progress.guest_session_id` references `guest_sessions.id`.
- `guest_challenge_progress.challenge_id` references `challenges.id`.
- YDB stores these relation IDs but does not enforce foreign-key cascades; the repository layer must check existence and perform related deletes/updates in transactions.

### YDB Step 4: Create Initial Goose Migration

Create the first YDB migration file with:

- `-- +goose Up` table and index creation.
- `-- +goose Down` table and index drops in reverse dependency order.
- No application code changes yet.

Checkpoint:

- `goose status` shows the migration as pending.
- `goose up` applies locally.
- YDB UI shows the expected tables and indexes.
- `goose down` rolls it back cleanly on a disposable local DB.

Result:

- Consulted YDB v26.1 Goose migration docs before creating the migration.
- Consulted YDB `CREATE TABLE` and secondary index docs for table/index syntax.
- Created `apps/api/db/migrations/20260801135000_00001_create_initial_schema.sql`.
- Used `GLOBAL UNIQUE SYNC` secondary indexes for `users.email`, `challenge_snippets.slug`, and `challenges.slug`.
- Used regular global secondary indexes for relation/topic/review lookups.
- Verified `pnpm.cmd db:status` showed the migration as pending.
- Verified `pnpm.cmd db:migrate` applied the migration locally.
- Verified `goose down` rolled the migration back.
- Re-applied with `pnpm.cmd db:migrate`, leaving local YDB at version `20260801135000`.

### YDB Step 5: Add YDB Client Module

Add a small YDB client boundary in `apps/api/src/lib`:

- Create and reuse one YDB `Driver`.
- Load connection string from env.
- Expose lifecycle helpers for server startup/shutdown.
- Add a simple health query equivalent to the current Prisma startup check.
- Keep YDB query helpers narrow and typed.

Checkpoint:

- API build passes.
- A temporary local script can connect to YDB and run `SELECT 1`.
- Existing app behavior remains on Prisma/PostgreSQL.

Result:

- Consulted YDB JS SDK query/core docs before adding the module.
- Added `@ydbjs/core` and `@ydbjs/query` to `apps/api`.
- Added `apps/api/src/lib/db.ts` with one reused YDB `Driver`, one reused query client, `checkDbHealth()` using `SELECT 1 AS one`, and `closeDb()` for shutdown cleanup.
- Made `DB_CONNECTION_STRING` required by runtime env validation.
- Added YDB startup health validation in `apps/api/src/server.ts`.
- Added SIGINT/SIGTERM shutdown cleanup for the YDB driver.
- Repaired the interrupted accidental deletion of `apps/api/src/features/auth/auth.repository.ts`; no auth repository rewrite was kept in this step.
- Repository rewrites were not started. Prisma still backs existing repositories only because Step 6+ have not been performed yet.

Actual verification:

```bash
pnpm.cmd --filter api build
node -e "import('dotenv/config').then(() => import('./dist/lib/db.js')).then(async (m) => { await m.checkDbHealth(); m.closeDb(); console.log('YDB health check passed'); })"
```

- API build passed.
- The temporary local script printed `YDB health check passed`.

### YDB Step 6: Define Repository Contracts Before Rewriting

Before replacing Prisma calls, document the repository-level operations currently needed by:

- `auth.repository.ts`
- `guest-sessions.repository.ts`
- `challenge-snippets.repository.ts`
- `challenges.repository.ts`
- `seed.ts`

Then create or preserve TypeScript types for those operations so the service/controller layers do not need large rewrites.

The contract list must explicitly map Prisma/PostgreSQL behavior to YDB replacements:

- Prisma model field names -> YDB snake_case table/column names.
- Prisma `include` / relation loads -> explicit YDB query joins or follow-up reads.
- Prisma `upsert` -> YDB `UPSERT` plus read-before-write when the response needs created/updated rows.
- Prisma `$transaction` -> YDB query transaction boundaries.
- Prisma cascading deletes -> explicit deletes in repository transactions.
- Prisma unique constraint checks -> YDB unique secondary-index lookups and conflict handling.
- Prisma `Date`/`@updatedAt` behavior -> application-managed timestamps.
- Prisma nullable owner columns in `ChallengeProgress` -> separate `user_challenge_progress` and `guest_challenge_progress` tables.

Checkpoint:

- Owner reviews the repository contract list.
- API still builds against the existing Prisma implementation.
- No repository rewrite is started in this step.

Result:

- Consulted YDB v26.1 docs before documenting the contracts.
- Re-read `.agents`, package scripts, shared Zod contracts, current Prisma repositories/services, `apps/api/src/lib/db.ts`, and the initial YDB migration.
- Preserved the current service/controller boundary as the TypeScript contract target. Repository ports should continue returning shared DTO types from `@repo/shared-types` plus existing local service types such as `ChallengePracticeActor`; do not leak YDB row shapes into controllers.
- No repository rewrite was started in this step.
- `pnpm.cmd --filter api build` passed after the documentation update.

Field mapping to preserve:

```text
User.id                         -> users.id
User.fullName                   -> users.full_name
User.email                      -> users.email
User.avatarUrl                  -> users.avatar_url
User.createdAt                  -> users.created_at
User.updatedAt                  -> users.updated_at

OAuthAccount.id                 -> oauth_accounts.id
OAuthAccount.provider           -> oauth_accounts.provider
OAuthAccount.providerAccountId  -> oauth_accounts.provider_account_id
OAuthAccount.userId             -> oauth_accounts.user_id
OAuthAccount.email              -> oauth_accounts.email
OAuthAccount.createdAt          -> oauth_accounts.created_at
OAuthAccount.updatedAt          -> oauth_accounts.updated_at

GuestSession.id                 -> guest_sessions.id
GuestSession.createdAt          -> guest_sessions.created_at
GuestSession.updatedAt          -> guest_sessions.updated_at

ChallengeSnippet.id             -> challenge_snippets.id
ChallengeSnippet.slug           -> challenge_snippets.slug
ChallengeSnippet.topicSlug      -> challenge_snippets.topic_slug
ChallengeSnippet.title          -> challenge_snippets.title
ChallengeSnippet.language       -> challenge_snippets.language
ChallengeSnippet.code           -> challenge_snippets.code
ChallengeSnippet.createdAt      -> challenge_snippets.created_at
ChallengeSnippet.updatedAt      -> challenge_snippets.updated_at

Challenge.id                    -> challenges.id
Challenge.snippetId             -> challenges.snippet_id
Challenge.slug                  -> challenges.slug
Challenge.topicSlug             -> challenges.topic_slug
Challenge.title                 -> challenges.title
Challenge.prompt                -> challenges.prompt
Challenge.code                  -> challenges.code
Challenge.order                 -> challenges.challenge_order
Challenge.createdAt             -> challenges.created_at
Challenge.updatedAt             -> challenges.updated_at

ChallengeOption.id              -> challenge_options.id
ChallengeOption.challengeId     -> challenge_options.challenge_id
ChallengeOption.order           -> challenge_options.option_order
ChallengeOption.label           -> challenge_options.label
ChallengeOption.isCorrect       -> challenge_options.is_correct
ChallengeOption.feedback        -> challenge_options.feedback

ChallengeProgress.userId        -> user_challenge_progress.user_id
ChallengeProgress.guestSessionId-> guest_challenge_progress.guest_session_id
ChallengeProgress.challengeId   -> *_challenge_progress.challenge_id
ChallengeProgress.needsReview   -> *_challenge_progress.needs_review
ChallengeProgress.answeredCount -> *_challenge_progress.answered_count
ChallengeProgress.correctCount  -> *_challenge_progress.correct_count
ChallengeProgress.updatedAt     -> *_challenge_progress.updated_at
```

General YDB repository rules:

- Generate UUIDs in TypeScript for every inserted row ID.
- Set `created_at` and `updated_at` in application code. Every update path must set `updated_at`; progress writes update only `updated_at` because progress rows have no `created_at` column.
- Convert YDB `Timestamp` values to shared contract ISO strings before returning from repositories.
- Convert nullable YDB values to the exact shared DTO shape. Public `Challenge.code` remains `string | null` in admin responses and becomes combined runnable code in public session responses.
- Use explicit YDB transactions for multi-row mutations that currently use Prisma `$transaction`.
- Replace Prisma relation `include` with explicit reads or joins, keeping ordering stable.
- Replace Prisma `upsert` with YDB read-before-write plus `UPSERT` or guarded `INSERT`/`UPDATE` as appropriate. If the response needs final row data, read it after the write in the same logical operation.
- Replace Prisma uniqueness assumptions with YDB unique secondary-index lookups and deterministic conflict handling.
- Replace Prisma cascading deletes with explicit repository deletes in the same transaction.
- For list endpoints, preserve current pagination metadata: `total`, `page`, `limit`, `totalPages = Math.ceil(total / limit)`.
- Keep admin `q` search scan-based for the first YDB slice. Do not add a search index in the initial port.
- Do not add dual reads, dual writes, Prisma fallback, or compatibility branches.

Auth repository contract:

- `findUserById(id: string)` returns a row compatible with shared `User` DTO mapping or `null`.
- YDB implementation reads `users` by primary key and maps snake_case columns to camelCase.
- `upsertGoogleUser(input)` must preserve current semantics:
  - input shape: `{ avatarUrl: string | null; email: string; fullName: string; providerAccountId: string }`
  - lookup user by `users_email_unique`
  - create user if missing
  - update `full_name`, `avatar_url`, and `updated_at` if present
  - link Google identity in `oauth_accounts`
  - enforce unique `(provider, provider_account_id)` through `oauth_accounts_provider_account_unique`
  - return the final user row for token creation and response mapping
- Conflict rule: if the Google provider account already points to another user than the email-selected user, do not silently relink it. Treat it as an authentication conflict/error path before broadening behavior.
- Step 7 must also remove `type User as PrismaUser` from `auth.service.ts` by replacing it with a service-facing user record/DTO type that does not import `lib/prisma.ts`.

Guest-session repository contract:

- `find(id)` returns `GuestSessionSummary | null`.
- `findOrCreate(id)` returns `{ created: boolean; guestSession: GuestSessionSummary }`.
- `discard(id)` returns deleted guest session ID or `null`.
- `mergeIntoUser(userId, guestSessionId)` returns `{ discarded: boolean; guestSessionId: string | null; mergedProgressCount: number }`.
- Summary behavior must stay:
  - `progressCount` is number of `guest_challenge_progress` rows.
  - `totalAnswered` is sum of `answered_count`.
  - `needsReviewCount` is rows where `needs_review = true`.
- `findOrCreate` creates a new UUID guest session only when no supplied valid session exists.
- `discard` transaction deletes `guest_challenge_progress` rows for the session, then deletes `guest_sessions`.
- `mergeIntoUser` transaction:
  - no `guestSessionId` returns discarded false and zero count
  - missing guest session returns discarded false, supplied ID, zero count
  - for each guest progress row, read `user_challenge_progress` by `(user_id, challenge_id)`
  - existing user progress adds `answered_count` and `correct_count`, sets `needs_review` to existing OR guest, updates `updated_at`
  - missing user progress inserts row with the guest counters/review flag
  - deletes guest progress rows and guest session after merge
  - returns merged count equal to the number of guest progress rows read

Challenge-snippets repository contract:

- `create(input)` inserts into `challenge_snippets`, sets generated UUID and timestamps, and returns `ChallengeSnippet`.
- `findById(id)` returns a row compatible with service existence checks.
- `findBySlug(slug)` uses `challenge_snippets_slug_unique` and returns at least `{ id } | null`.
- `list(query)` preserves filters:
  - `slug` contains, case-insensitive
  - `topicSlug` exact
  - `q` contains title or code, case-insensitive
  - sort by requested field plus stable tiebreakers `topicSlug asc`, `createdAt asc`, `id asc`
  - page/limit offset pagination and total count
- `update(id, input)` updates only provided fields, sets `updated_at`, and returns `ChallengeSnippet`.
- `delete(id)` transaction:
  - return `{ id: null, isUsed: false }` when missing
  - check `challenges_by_snippet` / `challenges.snippet_id` before delete
  - return `{ id, isUsed: true }` when referenced
  - otherwise delete snippet and return `{ id, isUsed: false }`
- Duplicate slug handling remains in the service via `findBySlug`; YDB unique index errors should still be translated deterministically if a race happens.

Challenges repository contract:

- `findById(id)` loads a challenge with all options ordered by `option_order asc`.
- `findBySlug(slug)` uses `challenges_slug_unique` and returns at least `{ id } | null`.
- `create(input)` inserts one `challenges` row and three `challenge_options` rows in a transaction, then returns `ChallengeWithAnswer`.
- `update(id, input)` updates provided challenge fields, sets `updated_at`, and if options are supplied deletes old options then inserts replacement options in the same transaction.
- `delete(id)` transaction deletes actor progress rows from both `user_challenge_progress` and `guest_challenge_progress`, deletes `challenge_options`, then deletes `challenges`.
- `list(query)` preserves filters:
  - `slug` contains, case-insensitive
  - `topicSlug` exact
  - `snippetId` exact
  - `q` contains title, prompt, or linked snippet code, case-insensitive
  - sort by requested field plus stable tiebreakers `topicSlug asc`, `order asc`, `createdAt asc`, `id asc`
  - include options with answer metadata ordered by `option_order asc`
- `dashboard(actor)` preserves:
  - total challenge count
  - topic counts grouped by `topic_slug`, sorted asc
  - actor progress from `user_challenge_progress` when `actor.userId` exists, else `guest_challenge_progress`
  - `totalAnswered` = progress rows with `answered_count > 0`
  - `totalCorrect` = answered rows where `needs_review = false`
  - `totalWrong` / `reviewCount` = rows where `needs_review = true`
  - `authRequired` = guest actor and sum of `answered_count` >= 50
  - `answeredToday` remains `0`
- `next(actor, mode)` preserves:
  - `answered` = sum of actor `answered_count`
  - `total` = total challenge count
  - practice mode returns first ordered challenge with no actor progress row where `answered_count > 0`
  - review mode returns first ordered challenge with actor progress where `needs_review = true`
  - public challenge response loads snippet code and combines it before challenge code with a blank line when challenge code exists
  - public options omit `isCorrect` and `feedback`
- `answer(actor, challengeId, input)` transaction:
  - load challenge options
  - return `null` when challenge or selected/correct option is missing
  - selected correct option determines `isCorrect`
  - upsert actor progress in the actor-specific progress table
  - every answer increments `answered_count`
  - correct answer increments `correct_count` and clears `needs_review`
  - wrong answer sets `needs_review`
  - return selected/correct option IDs, selected feedback, and mapped progress
- `restart(actor)` deletes only the actor-specific progress rows and returns `{ resetCount }`.
- Contract gap to close before challenge writes move to YDB: shared `CreateChallengeInput.order` and `createChallengeSchema.order` are currently optional, while YDB `challenge_order` has no autoincrement fallback. Step 9 must make order required at API/seed level before or with the YDB `create` port.

Seed script contract:

- Current `apps/api/src/scripts/seed.ts` only checks Prisma connectivity and logs that no auth users are seeded.
- Step 10 must replace this with YDB-backed behavior:
  - run `checkDbHealth()` or equivalent
  - seed no auth users unless explicitly introduced later
  - if content seeding is added, reuse API-compatible repository inputs and deterministic duplicate-slug handling
  - close the YDB driver in `finally`
  - leave Prisma disconnected from the seed path

### YDB Step 7: Port Auth And Guest Sessions To YDB

Replace Prisma in the auth and guest-session persistence paths:

- `auth.repository.ts`
  - `findUserById`
  - Google user create/update
  - OAuth account link/create
- `guest-sessions.repository.ts`
  - find current guest session summary
  - create guest session
  - discard guest session and guest progress
  - merge guest progress into user progress

Remove Prisma imports from these files as part of this step. Do not keep dual-read or dual-write logic.

Checkpoint:

- API build passes.
- `/api/me` still returns the same typed response for a valid access token.
- Guest session start/current/discard endpoints work against YDB.
- Google callback can create/link a YDB user and merge guest progress.
- `rg "prisma" apps/api/src/features/auth apps/api/src/features/guest-sessions` returns no active imports/usages.

Result:

- Consulted YDB v26.1 docs before starting this step.
- Replaced Prisma in `apps/api/src/features/auth/auth.repository.ts` with YDB reads/writes:
  - `findUserById` reads `users` by primary key.
  - `upsertGoogleUser` uses a YDB transaction, checks user email and Google provider account uniqueness, creates/updates `users`, links/updates `oauth_accounts`, and returns the shared `User` DTO.
  - Existing OAuth account `created_at` is preserved; `updated_at` is advanced.
- Removed the Prisma type import from `apps/api/src/features/auth/auth.service.ts`; auth service now consumes shared `User` DTOs from the repository.
- Replaced Prisma in `apps/api/src/features/guest-sessions/guest-sessions.repository.ts` with YDB reads/writes:
  - `find` and `findOrCreate` use `guest_sessions` plus aggregate reads from `guest_challenge_progress`.
  - `discard` deletes guest progress and session in one YDB transaction.
  - `mergeIntoUser` reads guest progress, adds counters into `user_challenge_progress`, ORs `needs_review`, deletes guest progress/session, and returns the existing merge summary shape.
- Added `apps/api/src/lib/db-utils.ts` for YDB timestamp/count conversion and nullable Utf8 fragments. The nullable helper is required because the `@ydbjs/query` tagged template rejects JavaScript `null` values directly.
- No Prisma fallback or dual-write path was added.

Actual verification:

```bash
pnpm.cmd --filter api build
rg "prisma|Prisma|lib/prisma" apps/api/src/features/auth apps/api/src/features/guest-sessions -n
pnpm.cmd db:status
pnpm.cmd --dir apps/api exec tsx src/scripts/db-step7-smoke.ts
```

- API build passed.
- The Prisma grep returned no matches in auth or guest-session feature folders.
- YDB migration status showed `20260801135000_00001_create_initial_schema.sql` applied.
- Temporary YDB smoke passed for auth user upsert/read, guest session create/summary, guest progress merge into user progress, guest discard, and cleanup.
- The temporary smoke script was deleted after verification.

### YDB Step 8: Port Challenge Snippet Management To YDB

Replace Prisma in `challenge-snippets.repository.ts`:

- create snippet
- find by id
- find by slug
- list with pagination/filter/sort
- update snippet
- delete snippet only when no challenge references it

Translate Prisma query behavior to YDB:

- Use `challenge_snippets` for snippet rows.
- Check `challenges` by `snippet_id` before deletion.
- Keep admin `q` search scan-based for now.
- Preserve response DTO shape and timestamp formatting.

Checkpoint:

- API build passes.
- Swagger snippet CRUD works against YDB.
- Duplicate slug handling remains deterministic.
- Deleting a snippet referenced by challenges returns the same conflict behavior.
- `rg "prisma" apps/api/src/features/challenge-snippets` returns no active imports/usages.

Result:

- Consulted YDB v26.1 docs before starting this step, including YQL `SELECT`, `ILIKE`, `ORDER BY`, `LIMIT/OFFSET`, `UPDATE`, `DELETE`, and secondary-index `VIEW` behavior.
- Replaced Prisma in `apps/api/src/features/challenge-snippets/challenge-snippets.repository.ts` with YDB reads/writes:
  - `create` inserts into `challenge_snippets`, generates a UUID in TypeScript, sets timestamps in YDB, and returns the shared `ChallengeSnippet` DTO.
  - `findById` reads by primary key and returns a row compatible with snippet and challenge service existence checks.
  - `findBySlug` reads through `challenge_snippets_slug_unique`.
  - `list` preserves pagination, total count, exact `topicSlug`, case-insensitive contains filters for `slug`, `title`, and `code`, scan-based `q`, and stable sort tiebreakers.
  - `update` updates only provided fields and advances `updated_at`.
  - `delete` runs in a YDB transaction, checks `challenges VIEW challenges_by_snippet`, returns the same used/missing result shape, and deletes only unused snippets.
- Dynamic list ordering uses hardcoded trusted column/direction mappings; user-provided values remain bound parameters.
- No Prisma fallback or dual-write path was added.

Actual verification:

```bash
pnpm.cmd --dir apps/api exec tsx src/scripts/db-step8-smoke.ts
pnpm.cmd --filter api build
rg "prisma|Prisma|lib/prisma" apps/api/src/features/challenge-snippets -n
pnpm.cmd db:status
```

- Temporary YDB smoke passed for snippet create, find by ID, find by slug, list filtering, update, delete conflict when referenced by a challenge, delete after removing the challenge, and cleanup.
- API build passed.
- The Prisma grep returned no matches in the challenge-snippets feature folder.
- YDB migration status showed `20260801135000_00001_create_initial_schema.sql` applied.
- The temporary smoke script was deleted after verification.

### YDB Step 9: Port Challenge Management And Practice Flow To YDB

Replace Prisma in `challenges.repository.ts`:

- admin challenge CRUD
- list/detail reads with options
- public dashboard
- next practice card
- next review card
- answer submission and progress update
- restart progress

Translate Prisma query behavior to YDB:

- Use `challenges`, `challenge_options`, and `challenge_snippets` for card reads.
- Use `user_challenge_progress` and `guest_challenge_progress` depending on actor.
- Use YDB transactions for create/update/delete/answer/restart paths.
- Delete challenge progress and options explicitly before deleting a challenge.
- Preserve current dashboard semantics:
  - `totalAnswered` = answered cards
  - `totalCorrect` = answered cards not currently needing review
  - `totalWrong` = current review cards
  - answer-attempt sum gates guest auth at 50

Checkpoint:

- API build passes.
- Swagger challenge CRUD works against YDB.
- Public practice, review, answer, dashboard, and restart endpoints work against YDB.
- `rg "prisma" apps/api/src/features/challenges` returns no active imports/usages.

Result:

- Consulted YDB v26.1 docs before starting this step, including YQL `SELECT`, `JOIN`, `ILIKE`, `ORDER BY`, `LIMIT/OFFSET`, `UPDATE`, `DELETE`, and unsupported correlated `NOT EXISTS` guidance.
- Made `CreateChallengeInput.order` and `createChallengeSchema.order` required in `packages/shared-types/src/features/challenges/challenges.schemas.ts`, closing the `challenge_order` no-autoincrement contract gap.
- Replaced Prisma in `apps/api/src/features/challenges/challenges.repository.ts` with YDB reads/writes:
  - `create` inserts one `challenges` row and three `challenge_options` rows in a YDB transaction.
  - `findById` loads a challenge plus options ordered by `option_order`.
  - `findBySlug` reads through `challenges_slug_unique`.
  - `list` preserves pagination, total count, filters, scan-based `q`, snippet-code search through a join, option loading, and stable sort tiebreakers.
  - `update` updates only provided challenge fields, supports nullable challenge `code`, advances `updated_at`, and replaces options transactionally when options are supplied.
  - `delete` explicitly removes user progress, guest progress, options, then the challenge.
  - `dashboard` preserves current card-state totals, topic summaries, guest auth gate math, and `answeredToday = 0`.
  - `next` preserves practice/review selection and public runnable-code composition from snippet code plus challenge code.
  - `answer` preserves selected/correct option result, feedback, and actor-specific progress updates.
  - `restart` deletes only actor-specific progress rows and returns the deleted count.
- Practice-mode next-card selection uses a prefiltered progress subquery with `LEFT JOIN` because YDB join equality predicates cannot include a parameter-dependent expression directly in `ON`.
- Dynamic table/column/sort fragments are restricted to hardcoded trusted mappings; user values remain bound parameters.
- No Prisma fallback or dual-write path was added.

Actual verification:

```bash
pnpm.cmd exec tsx src/scripts/db-step9-smoke.ts
pnpm.cmd --filter @repo/shared-types build
pnpm.cmd --filter api build
pnpm.cmd --filter web build
rg "prisma|Prisma|lib/prisma" apps/api/src/features/challenges -n
pnpm.cmd db:status
```

- Temporary YDB smoke passed for challenge create, find by ID, find by slug, list filtering/search, update including nullable `code`, next practice, wrong answer, dashboard totals, next review, correct answer clearing review, next practice advancing, restart, delete, and cleanup.
- Shared-types build passed.
- API build passed.
- Web build passed.
- The Prisma grep returned no matches in the challenges feature folder.
- YDB migration status showed `20260801135000_00001_create_initial_schema.sql` applied.
- The temporary smoke script was deleted after verification.

### YDB Step 10: Move Seed Workflow To YDB

Replace Prisma seed behavior with YDB writes:

- Update `apps/api/src/scripts/seed.ts` to use YDB health/write helpers or API-compatible database repositories.
- Keep existing seed payloads and temporary Swagger/web seed routes when possible.
- Ensure duplicate slugs are handled deterministically.
- Confirm snippet IDs remain UUIDs compatible with shared schemas.

Checkpoint:

- API build passes.
- Local empty YDB can be migrated and seeded.
- `/challenges` can load playable cards from YDB.
- `rg "prisma" apps/api/src/scripts` returns no active imports/usages.

Result:

- Consulted YDB v26.1 docs before starting this step.
- Replaced Prisma in `apps/api/src/scripts/seed.ts` with `checkDbHealth()` from `apps/api/src/lib/db.ts`.
- Seed still does not create auth users, preserving the Google-only auth direction.
- Seed now closes the YDB driver with `closeDb()` in `finally`.
- Seed failure now sets `process.exitCode = 1`.
- Later update on 2026-08-02: `pnpm seed` now validates and inserts reusable challenge snippets from `challenges/seed-snippets.ts`, skips duplicate slugs, and still seeds no auth users. Temporary web/API challenge seed routes remain unchanged and continue to go through YDB-backed repositories.
- No Prisma fallback was added.

Actual verification:

```bash
pnpm.cmd --filter api build
pnpm.cmd seed
pnpm.cmd db:status
rg "prisma|Prisma|lib/prisma" apps/api/src/scripts -n
```

- API build passed.
- `pnpm.cmd seed` originally completed through the YDB health check and printed `Seed completed. No auth users are seeded for Google-only auth.` Later verification seeded 71 reusable snippets and then skipped those same 71 snippets on a repeat run.
- YDB migration status showed `20260801135000_00001_create_initial_schema.sql` applied.
- The Prisma grep returned no matches in `apps/api/src/scripts`.

### YDB Step 11: Remove Prisma/Postgres Runtime Dependencies

After every repository and seed path is YDB-backed, remove Prisma/PostgreSQL from active repo usage:

- Remove `@prisma/client`, `@prisma/adapter-pg`, `prisma`, `pg`, and `@types/pg`.
- Delete `apps/api/prisma`.
- Delete `apps/api/prisma.config.ts`.
- Delete `apps/api/src/lib/prisma.ts`.
- Delete `apps/api/src/generated/prisma` if present.
- Remove Prisma scripts from `apps/api/package.json`.
- Remove root Postgres/Prisma script behavior: old Postgres compose targets,
  `db:logs`, `db:migrate:dev`, `db:migrate:deploy`, and `prisma:generate`.
  Keep `db:up`, `db:down`, `db:migrate`, and `db:status` as the active
  YDB-backed database commands.
- Remove `DATABASE_URL` and `DATABASE_URL_NEON` from active env validation and active Turborepo env.
- Remove Postgres compose/Docker references from active local workflow.
- Keep only clearly labeled historical references if they are useful; otherwise delete docs references.
- Update lockfile through `pnpm`, never manually.

Checkpoint:

- `pnpm install` completes.
- API build passes.
- `rg "prisma|postgres|DATABASE_URL|@prisma|pg" apps packages infra package.json turbo.json .github docs README.md` finds no active runtime/config references.
- Any remaining matches are explicitly historical/migration-plan-only and reviewed.

Result:

- Consulted the YDB v26.1 docs before removing runtime dependencies.
- Removed `@prisma/client`, `@prisma/adapter-pg`, `pg`, `prisma`, and `@types/pg` from `apps/api` through pnpm so `pnpm-lock.yaml` stayed tool-managed.
- Removed Prisma scripts from `apps/api/package.json`.
- Removed root Postgres/Prisma script behavior and stale commands:
  `db:logs`, `db:migrate:dev`, `db:migrate:deploy`, and `prisma:generate`.
  Kept `db:up`, `db:down`, `db:migrate`, and `db:status` for the active
  YDB-backed database workflow.
- Updated root `docker:run` to pass `DB_CONNECTION_STRING=grpc://host.docker.internal:2136/local` instead of `DATABASE_URL`.
- Removed `DATABASE_URL` and `DATABASE_URL_NEON` from active env examples, env typings, runtime env validation, and Turborepo env.
- Removed Prisma generation and Prisma directory copies from Dockerfiles.
- Removed generated Prisma dockerignore entries.
- Updated the active Yandex Cloud deployment workflow to pass `DB_CONNECTION_STRING` instead of `DATABASE_URL`.
- Deleted `apps/api/prisma`, `apps/api/prisma.config.ts`, `apps/api/src/lib/prisma.ts`, `apps/api/src/generated/prisma`, and `infra/postgres.compose.yaml`.
- Broad scan still finds Prisma/Postgres/DATABASE_URL matches in documentation files only; those are assigned to Step 12.

Actual verification:

```bash
pnpm.cmd install
pnpm.cmd --filter @repo/shared-types build
pnpm.cmd --filter api build
pnpm.cmd check
pnpm.cmd seed
rg "prisma|Prisma|postgres|Postgres|DATABASE_URL|DATABASE_URL_NEON|@prisma|\bpg\b" apps packages infra package.json turbo.json .github -n --glob "!**/README.md"
```

- `pnpm.cmd install` completed with the lockfile current.
- Shared types build passed.
- API build passed.
- Full `pnpm.cmd check` passed, including the web production build.
- `pnpm.cmd seed` completed through the YDB-only seed workflow.
- The active-config scan returned no matches.

### YDB Step 12: Update Docs And Deployment For YDB Only

Update:

- Root `README.md` tech stack and commands.
- `apps/api/README.md`.
- `docs/RUNBOOK.md`.
- `infra/README.md`.
- GitHub Actions and Yandex Cloud deployment env.
- Docker build/run commands and env examples.
- Secret/variable names in deployment docs.

Checkpoint:

- Local dev docs describe YDB only.
- Production docs describe how to configure YDB connection/auth.
- Old Neon/Postgres/Prisma migration instructions are gone or clearly marked historical.
- `DATABASE_URL` is not documented as an active runtime variable.

Result:

- Consulted the YDB v26.1 docs before updating YDB-related docs.
- Updated root `README.md` tech stack, repository map, local preview commands, local URLs, and API notes to YDB/Goose terminology.
- Updated `apps/api/README.md` to describe YDB persistence, Goose migrations, database env vars, and `pnpm db:*` commands.
- Rewrote `docs/RUNBOOK.md` around YDB local development, Docker runtime env, Goose migrations, Yandex Cloud deployment env, GitHub secrets, and troubleshooting.
- Updated `infra/README.md` to describe external/host-local YDB, `DB_CONNECTION_STRING`, and `pnpm db:migrate`.
- Updated `.agents/AGENTS.md` future-facing commands and conventions so new work starts from YDB-only guidance.
- Active GitHub Actions deployment env already uses `DB_CONNECTION_STRING`.

Actual verification:

```bash
rg "prisma|Prisma|postgres|Postgres|DATABASE_URL|DATABASE_URL_NEON|Neon|@prisma|\bpg\b" README.md docs apps/api infra .github .agents/AGENTS.md -n
pnpm.cmd check
```

- The stale-stack documentation scan returned no matches.
- `pnpm.cmd check` passed, including API and web builds.

### YDB Step 13: Final Verification

Run the full verification set:

```bash
pnpm install
pnpm db:up
pnpm db:migrate
pnpm seed
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web build
pnpm lint
pnpm docker:build
```

Manual checks:

- Start local YDB.
- Apply Goose migrations.
- Seed reusable snippets with `pnpm seed`; seed challenges through the temporary `/snippet-test` flow if challenge content is needed.
- Start API and web.
- Complete a guest practice answer.
- Complete a wrong-card review flow.
- Restart progress.
- Complete Google OAuth and verify guest progress merge.
- Confirm deployed/container health check hits YDB-backed API successfully.

Checkpoint:

- Owner confirms YDB is the only supported active persistence backend.
- No active Prisma/PostgreSQL code, config, scripts, env, generated clients, Docker services, or docs remain.
- Local automated and Docker verification are recorded below.

Result:

- Consulted the YDB v26.1 docs before final verification.
- Ran the full local automated verification set:

```bash
pnpm.cmd install
pnpm.cmd db:up
pnpm.cmd db:migrate
pnpm.cmd seed
pnpm.cmd --filter @repo/shared-types build
pnpm.cmd --filter api build
pnpm.cmd --filter web build
pnpm.cmd lint
pnpm.cmd docker:build
```

- `pnpm.cmd install` completed with the lockfile current.
- `pnpm.cmd db:up` started local YDB; an old local Postgres orphan was reported initially and was removed.
- `pnpm.cmd db:migrate` reported no pending migrations at version `20260801135000`.
- `pnpm.cmd seed` completed through the YDB-only seed workflow.
- Shared types, API, and web builds passed.
- `pnpm.cmd lint` passed with one existing warning in `apps/web/src/components/code-runner.tsx` for `react-hooks/set-state-in-effect`.
- `pnpm.cmd docker:build` passed after Prisma/PostgreSQL removal.
- Final Docker smoke found and fixed two runtime issues:
  - local YDB discovery advertised loopback back to the application container, so `apps/api/src/lib/db.ts` now disables YDB endpoint discovery for explicit local hosts (`localhost`, `127.0.0.1`, `host.docker.internal`);
  - production `NODE_ENV` in local Docker marked cookies `Secure` on HTTP localhost, so auth/guest cookies now use secure cookies when `WEB_ORIGIN` is HTTPS and allow HTTP localhost.
- Rebuilt the Docker image after those fixes.
- Container smoke passed on `http://localhost:3100` with:
  - public health route returning `{ "status": "healthy" }`;
  - disposable admin snippet/challenge creation;
  - guest practice next-card retrieval;
  - wrong answer recording with `needsReview = true`;
  - review mode returning that card;
  - restart clearing one progress row;
  - disposable challenge/snippet cleanup.
- Final YDB status shows `20260801135000_00001_create_initial_schema.sql` applied.
- Final Docker process list shows only `repo-db-local` as the running database container.
- Final removed-stack scan returned no matches in active repo/docs paths:

```bash
rg "prisma|Prisma|postgres|Postgres|DATABASE_URL|DATABASE_URL_NEON|Neon|@prisma|\bpg\b" apps packages infra package.json turbo.json .github README.md docs .agents/AGENTS.md -n
```

External/manual checks not completed by the agent:

- Real Google OAuth browser flow and guest progress merge require owner OAuth credentials/browser interaction.
- Yandex Cloud production deployment health requires owner cloud deployment context.

### YDB Step 14: Rename App-Level Database Internals To DB

Normalize app-owned naming now that YDB is the only active database:

- Rename app/client modules from `ydb` to `db`.
- Rename runtime env from `YDB_CONNECTION_STRING` to `DB_CONNECTION_STRING`.
- Rename the Goose migration path from `apps/api/ydb/migrations` to
  `apps/api/db/migrations`.
- Rename local compose from `infra/ydb.compose.yml` to `infra/db.compose.yml`.
- Rename root operational scripts from `ydb:*` to `db:*`.
- Keep provider-specific names where they are factual, including `@ydbjs/*`,
  `GOOSE_DRIVER=ydb`, the YDB Docker image, YDB docs, YDB UI, and YDB JDBC
  URLs.

Result:

- Renamed the database client boundary to `apps/api/src/lib/db.ts`.
- Renamed database helper modules to `apps/api/src/lib/db-utils.ts` and
  `apps/api/src/lib/db.sql.ts`.
- Updated API imports to use `getDb`, `checkDbHealth`, and `closeDb`.
- Updated `.env.example`, env typing, runtime validation, Turborepo env,
  Docker run scripts, GitHub Actions deployment env, README files, runbook,
  and agent handoff files to use `DB_CONNECTION_STRING`, `db:*` commands,
  `apps/api/db/migrations`, and `infra/db.compose.yml`.
- Updated local ignored `apps/api/.env` key names without changing secret
  values.
- Renamed the local compose service/container/volumes to `db`,
  `repo-db-local`, `db-data`, and `db-certs`.
- Mapped the YDB UI to host `9876` instead of host `8765` because Windows
  excluded the original port range.

Actual verification:

```bash
pnpm.cmd check
pnpm.cmd --filter api lint
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('turbo.json','utf8')); JSON.parse(require('fs').readFileSync('apps/api/package.json','utf8')); console.log('json ok')"
rg "YDB_CONNECTION_STRING|apps/api/ydb|infra/ydb|src/lib/ydb|ydb-utils|getYdb|checkYdb|closeYdb|selectYdb|ydb:" apps .agents docs infra README.md package.json turbo.json .github -n --glob "!node_modules/**" --glob "!.git/**"
```

- `pnpm.cmd check` passed.
- `pnpm.cmd --filter api lint` passed.
- `pnpm.cmd db:up` started `repo-db-local` successfully after moving the YDB UI
  host mapping to `9876:8765`.
- `pnpm.cmd db:migrate` applied
  `20260801135000_00001_create_initial_schema.sql`.
- `pnpm.cmd db:status` showed the migration applied.
- `pnpm.cmd seed` completed through the reusable snippet seed workflow.
- `pnpm.cmd --filter api build` and `pnpm.cmd --filter api lint` passed after
  command-line snippet seeding and YDB text-sort cleanup.
- `/api/challenge-snippets?page=1&limit=5&sortBy=title&sortDirection=desc`
  was verified through the local web rewrite. It now returns:
  `Undirected Graph Path Search`, `Topological Sort by Dependencies`,
  `Timeout-Based Number Printer`, `thisArg in Array Callbacks`,
  `Script, Microtask, and Macrotask Order`.
- YDB text sort note: `ORDER BY` can sort by expressions and `DESC`; for
  user-facing `Utf8` text fields use `Unicode::ToLower(...)` in the whitelisted
  sort expressions. The cleanup is in
  `apps/api/src/features/challenge-snippets/challenge-snippets.sql.ts` and
  `apps/api/src/features/challenges/challenges.sql.ts`.
- JSON parsing for root `package.json`, root `turbo.json`, and
  `apps/api/package.json` passed.
- The stale app-level name scan returned only this Step 14 rename record plus
  factual provider references: the YDB Docker image, YDB JDBC URL, and YDB docs
  link.
- Earlier `pnpm.cmd db:up` attempts failed on host ports `8765`, `8766`, and
  `8764` because those ports were inside a Windows TCP excluded range on this
  machine. The verified host UI port is `9876`.

## Flashcards Product Steps

These steps are the older product implementation backlog and historical result log. Continue them only after the YDB migration priority allows it.

## Step 1: Baseline And Contract Direction

### Todo

- Confirm current API and web builds still pass.
- Remove generated frontend client package from the active workspace.
- Confirm the target direction:
  - shared Zod schemas in `packages/shared-types`
  - Swagger/OpenAPI remains inside `apps/api`
  - frontend uses typed API wrappers + shared fetchers/SWR, not generated API client/types

### Result

Clear contract direction before changing schema or auth.

```text
packages/shared-types  shared Zod schemas and inferred types
apps/api               imports schemas and exposes Swagger/OpenAPI
apps/web/src/api       typed API wrappers used by SWR/fetchers
generated client       removed
```

Actual result:

- `pnpm --filter api build` passed.
- `pnpm --filter web build` passed.
- No code changes were required for this baseline step.

### Test

```bash
pnpm --filter api build
pnpm --filter web build
```

## Step 2: Shared Types And Frontend Fetcher Foundation

### Todo

- Make `apps/api` the clear owner of Swagger/OpenAPI.
- Remove the root generated API client command from the active workflow.
- Keep future API behavior checks as JetBrains/WebStorm `.http` request files, not unit tests.
- Add/build `packages/shared-types` with `tsdown`.
- Add shared schemas/types for:
  - health response
  - auth profile / `/api/me`
  - flashcard DTOs
- Add frontend data fetching for `apps/web`.
- Add a single frontend API layer under `apps/web/src/api`.
- Fully type the health request first as the smallest vertical slice.

### Result

Shared schemas and frontend data fetching foundation exist before building flashcard APIs.

Actual result so far:

- Added `packages/shared-types` as a compiled internal package.
- API imports schemas and DTO types from `@repo/shared-types`.
- API owns Swagger/OpenAPI.
- Old generated frontend client workflow was removed.
- Challenge schemas are the backend/API contract. User-facing copy can call them flashcards.
- Old user schemas were replaced with auth schemas.

### Test

```bash
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web build
```

## Step 3: Reshape Prisma Schema For Flashcards

### Todo

- Remove old todo domain:
  - `Task`
  - `Priority`
  - `Status`
- Remove app-native user account fields:
  - `password`
  - `role`
  - `status`
- Keep `User` only as the internal learner/account row owned by Google auth.
- Keep `OAuthAccount` as the Google identity link.
- Keep `GuestSession` only as a temporary anonymous progress buffer:
  - no `userId`
  - no long-term relation to `User`
  - destroy/discard after merge on login
- Model flashcard content:
  - `Challenge`
  - `ChallengeOption`
  - `ChallengeProgress`
- Do not add `difficulty`.
- Create a destructive dev migration. Old todo data is not worth preserving.

### Current Schema Direction

The schema intentionally keeps `Challenge*` names. In UI copy, each challenge is presented as a flashcard.

Important behavior:

- One flashcard presentation accepts one answer.
- Wrong answer increments `answeredCount`, sets `needsReview = true`, reveals the correct answer, then moves on.
- Correct answer increments `answeredCount` and `correctCount`, sets `needsReview = false`, then moves on.
- No second chance on the same card presentation.
- Review mode selects cards where `needsReview = true`.

### Test

```bash
pnpm db:up
pnpm db:migrate
pnpm --filter api build
```

Note: this was the historical Prisma schema step. Current local database
commands are `db:*`, and Prisma Studio is no longer available after the YDB
migration.

## Step 4: Remove Old Todo API Surface

### Todo

- Remove old task feature files from `apps/api/src/features/tasks`.
- Remove task router registration.
- Remove task-specific schemas/services/repositories.
- Remove old task shared schemas.
- Remove old task frontend leftovers if still present.

### Result

The backend is no longer half todo app, half flashcard app.

Actual result:

- Old task feature files were deleted.
- `/api/tasks` router registration was removed.
- Shared task schemas were deleted/unexported.
- API and web builds passed at the time this step was completed.

### Test

```bash
pnpm --filter api build
pnpm --filter web build
curl http://localhost:8080/api/healthz
```

## Step 5: Google-Only Auth Feature

### Todo

- Remove old `users` feature as an API surface.
- Remove custom email/password auth:
  - `/api/auth/register`
  - `/api/auth/login`
  - password hashing/verification
- Add auth feature module:

```text
apps/api/src/features/auth
```

- Install Hono OAuth provider package:

```bash
pnpm --filter api add @hono/oauth-providers
```

- Add env vars:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

- Add routes:

```text
GET /api/auth/google
GET /api/auth/google/callback
GET /api/me
```

- On Google callback:
  - find/create internal `User`
  - create/link `OAuthAccount`
  - merge current guest progress into the user
  - delete/discard guest session
  - clear guest cookie
  - set `accessToken` cookie
  - return the typed auth response; the frontend decides where to navigate next
- Keep auth checks fast: validate token first; fetch full user only when endpoint logic needs DB user state.

### Result

User can authorize with Google, profile state is visible through `/api/me`, and optional/protected API paths can identify the user.

Actual result so far:

- Old users/email-password feature was removed from active source.
- `@hono/oauth-providers` is installed in `apps/api`.
- `/api/auth/google`, `/api/auth/google/callback`, and `/api/me` are implemented and included in OpenAPI.
- Google callback validates the Google profile in `authService`, upserts `User`, links `OAuthAccount`, sets the `accessToken` cookie, and returns the shared `googleCallbackResponseSchema` response.
- Auth middleware reads `Authorization` or the `accessToken` cookie.
- Shared API HTTP/OpenAPI helpers are consolidated in `apps/api/src/shared/http.ts`.
- Temporary `/check-auth` web page starts Google OAuth and checks `/api/me`.
- Local Node networking to Google may intermittently fail; provider token exchange failures return `502`.
- Remaining implementation work:
  - Merge current guest progress into the user on Google callback.
  - Delete/discard the guest session and clear the guest cookie after merge.
  - Replace `/check-auth` with the real `/login` and `/flashcards` flows when those steps are reached.
- Before continuing, review and intentionally keep or revise the untracked migration folder:

```text
apps/api/prisma/migrations/20260630082212/
```

### Test

```bash
pnpm db:up
pnpm db:migrate
pnpm --filter api build
pnpm --filter web build
pnpm dev
```

Manual:

- Open `http://localhost:3000/check-auth`.
- Click Google login.
- Complete Google flow.
- Confirm callback returns the auth response and sets the cookie.
- Click "Check current user" and confirm `/api/me` returns the authenticated profile.

## Step 6: Flashcard Management API For Swagger

### Todo

- Add challenge feature module:

```text
apps/api/src/features/challenges
```

- Add Swagger-visible management endpoints:

```text
POST   /api/challenges
PATCH  /api/challenges/:id
DELETE /api/challenges/:id
```

- Challenge/flashcard shape:
  - `topicSlug`
  - `title`
  - `prompt`
  - `code`
  - `order`
  - 3 options
  - one correct option
  - feedback per option
- No `difficulty`.
- No admin UI for now. Add/manage flashcards through Swagger.

### Result

Challenges/flashcards can be added to the DB manually through Swagger without seeds or admin UI.

Actual result:

- Added `apps/api/src/features/challenges` with controller, OpenAPI routes, service, and repository.
- Added Swagger-visible management endpoints:
  - `GET /api/challenges`
  - `POST /api/challenges`
  - `PATCH /api/challenges/:id`
  - `DELETE /api/challenges/:id`
- `GET /api/challenges` supports pagination and filters:
  - `page`
  - `limit` up to 100
  - `topicSlug`
  - `slug`
  - `q` for title/prompt/code search
  - `sortBy`
  - `sortDirection`
- Challenge management endpoints require an authenticated user, but no roles/admin model was added.
- Create/update responses return the full challenge with answer metadata for manual Swagger inspection.
- Delete removes challenge progress and options before deleting the challenge.
- Duplicate slugs return `409`; missing challenges return `404`.
- Unauthenticated challenge creation returns `401`.
- Authenticated challenge create/delete smoke test passed with a temporary local user/token; the test challenge and user were deleted.
- Shared types, API, and web builds passed.

### Test

```bash
pnpm --filter api build
pnpm dev
```

Manual:

- Open `http://localhost:8080/api/swagger`.
- Create one flashcard.
- Verify it exists through the challenge list endpoint.

## Step 7: Public Flashcard Flow API With Guest Progress

### Todo

- Add optional-auth/guest-aware endpoints:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice
GET  /api/challenges/next?mode=review
POST /api/challenges/:id/answer
```

- Create/read one `GuestSession` from cookie for anonymous users.
- Update `ChallengeProgress` after each answer:
  - every answer increments `answeredCount`
  - correct answer increments `correctCount`
  - correct answer clears `needsReview`
  - wrong answer sets `needsReview`
- Return enough data for the player to show:
  - selected answer result
  - correct option
  - feedback/explanation
  - next-card availability
- Do not allow a second answer after a wrong answer on the same card presentation.

### Result

Users can practice without auth, wrong cards are tracked, and progress persists through the current guest cookie until login or destruction.

Actual result:

- Added public optional-auth/guest-aware challenge endpoints:
  - `GET /api/challenges/dashboard`
  - `GET /api/challenges/next?mode=practice`
  - `GET /api/challenges/next?mode=review`
  - `POST /api/challenges/:id/answer`
  - `POST /api/challenges/restart`
- Anonymous dashboard/next/answer requests create or reuse the `guestSessionId` cookie.
- Authenticated requests use the bearer token or `accessToken` cookie and store progress under the user.
- Answering increments `answeredCount`; correct answers increment `correctCount` and clear `needsReview`; wrong answers set `needsReview`.
- Practice mode returns unanswered cards; review mode returns cards where `needsReview = true`.
- Dashboard returns guest/auth progress totals, review count, auth gate state after 50 guest answers, and topic progress summaries.
- Dashboard totals now use current card-state counts:
  - `totalAnswered`: answered cards
  - `totalCorrect`: answered cards not currently needing review
  - `totalWrong`: cards currently needing review
- `answeredCount` remains an internal answer-attempt counter for the 50-answer guest auth gate and guest/user merge math.
- The API returns the selected result, correct option id, selected option id, selected feedback, and updated progress.
- The public player response returns runnable code with the reusable snippet first and challenge-specific code second.
- Restart clears the current user/guest progress so practice can start again after all cards are answered.

### Test

```bash
pnpm --filter api build
pnpm dev
```

Actual verification:

- `pnpm --filter @repo/shared-types build` passed.
- `pnpm --filter api build` passed.
- `pnpm --filter web build` passed.

Manual endpoint checks are still pending.

Manual:

- Create several flashcards in Swagger.
- Open next-card endpoint without logging in.
- Answer one correctly and one incorrectly.
- Confirm the wrong card appears in review mode.
- Confirm a wrong answer reveals the correct answer and cannot be re-answered in the same presentation.
- Log in and confirm guest progress merges into the Google account.
- Confirm the guest session is discarded after merge.

## Step 8: Login UI And 50-Answer Auth Gate

### Todo

- Add `/login`.
- Add "Continue with Google".
- Redirect logged-in users to `/flashcards`.
- Show dismissible Google auth prompt only for guests.
- Let guests practice until 50 answered flashcards.
- After 50 answers, block further practice and ask for Google auth.
- After login, merge current guest progress into the user and continue.

### Result

The app supports the intended acquisition flow: start immediately, require auth only after enough value has been shown.

### Test

- Practice as guest.
- Confirm progress saves.
- Simulate/reach 50 answered flashcards.
- Confirm auth gate appears.
- Log in with Google.
- Confirm progress is still present under the user.

## Step 8A: Transitional `/challenges` Practice UI

### Result

Actual result:

- The existing `/challenges` page is wired to the public challenge APIs.
- Mock challenge data was removed.
- `apps/web/src/api/challenges.ts` is the typed frontend API wrapper.
- The player uses SWR and `fetchers` with credentials.
- The page supports practice mode, review mode, answer locking, feedback, and `Start again` through `/api/challenges/restart`.
- Dashboard stats now consistently represent current card states. Correcting a previously wrong card moves it from wrong/review to right/mastered.

### Test

```bash
pnpm --filter api build
pnpm --filter web build
```

## Step 8B: Markdown Challenge Drafts

### Result

Actual result:

- Added root `challenges/*.md` draft files, one per snippet section from `challenges/snippets.md`.
- The folder currently contains 71 active Markdown draft files and 85 challenge drafts.
- Each file preserves the snippet metadata/code and appends one or more `### Challenge` sections.
- Challenge answers are written as `console.log` outputs/results for the MVP UI.
- Added `challenges/saved-snippets.ts` with persisted snippet IDs from the temporary admin seed flow.
- Added `challenges/separate-challenges/*.ts`, one generated challenge object per challenge draft.
- Generated challenge objects use `snippetId` from `saved-snippets.ts`, omit the reusable top snippet code, include only challenge-specific `code` or `null`, and intentionally do not import shared types.
- Each generated challenge keeps exactly three options, exactly one correct option, and distributes the correct answer position instead of always using option 1.
- Reviewed generated challenge content against `apps/web/content`; fixed mismatches such as `findDifference` vs `difference`, `myFilter` vs `customFilter`, and duplicate `object-literal-this` logging.

### Test

Actual verification:

- 85 generated challenge files parsed successfully.
- Every generated challenge has exactly three options and exactly one correct option.
- 48 runnable non-async/non-timer challenge-code cases executed without runtime errors.
- TypeScript check passed for the generated challenge shape before removing local type imports.

## Step 8C: Temporary Admin Seed Data UI

### Result

Actual result:

- `/snippet-test` now seeds both reusable snippets and flashcard challenges after admin authorization.
- `apps/web/src/app/snippet-test/snippets.ts` contains the older web UI snippet seed payload.
- `challenges/seed-snippets.ts` contains the reusable snippet seed payload now used by `pnpm seed`.
- `apps/web/src/app/snippet-test/seed-challenges.ts` contains 85 challenge seed objects generated from `challenges/separate-challenges`.
- The older seed UI flow seeded snippets and then challenges after admin authorization.
- Current command-line snippet seeding runs through `pnpm seed`; `/snippet-test` remains temporary for challenge seeding.
- Challenge seed requests post to `/api/challenges`, treat duplicate slugs as skipped, and report created/skipped/failed counts.

### Test

```bash
pnpm --filter web types:check
```

Actual verification:

- `pnpm.cmd --filter web types:check` passed.

## Step 9: Flashcards Dashboard UI

### Todo

- Replace placeholder quiz/challenge UI with the flashcards dashboard.
- Show:
  - greeting/profile control
  - answered today
  - total answered
  - remaining/new count
  - wrong/review count
  - topic progress
- Add buttons:
  - Practice
  - Review wrong cards

### Result

`/flashcards` is the main learning dashboard.

### Test

```bash
pnpm --filter web build
```

Manual:

- Open `/flashcards`.
- Confirm dashboard loads from API.
- Confirm guest/auth states render correctly.
- Practice/review buttons route correctly.

## Step 10: Endless Flashcard Player UI

### Todo

- Add `/flashcards/practice`.
- Add `/flashcards/review`.
- Implement flashcard player:
  - prompt
  - code block
  - 3 answer options
  - immediate green/red feedback
  - correct answer reveal on wrong answers
  - explanation/feedback
  - next button
  - progress indicator
  - close button
- Use typed API wrappers and SWR mutations for answers.
- Lock answer options after the first answer for that card presentation.

### Result

User can keep answering flashcards one after another, and wrong-card review works without retrying the same card immediately.

### Test

- Start practice.
- Answer correct and incorrect options.
- Confirm wrong answer locks choices and reveals correct answer.
- Click next and confirm a new card appears.
- Start review and confirm previously wrong cards appear.
- Confirm auth gate after 50 guest answers.

## Step 11: Confirm Generated Client Removal

### Todo

- Confirm generated-client references are gone from docs/workflows.
- Confirm web uses shared schemas and local API fetchers.
- Confirm shared contracts use auth/challenge naming and no old users/tasks naming.

### Result

The repo has one contract source: shared Zod schemas plus API Swagger.

### Test

```bash
pnpm install
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web build
pnpm lint
```

## Step 12: Docker And Deploy Check

### Todo

- Ensure combined Docker image still builds.
- Ensure API-only Yandex image still builds if kept.
- Update README if commands/routes changed.
- Update GitHub Actions if package paths changed.
- Check env docs for Google OAuth and shared schemas.

### Result

Local Docker and the combined Yandex Cloud container deploy remain documented and working.

### Test

```bash
pnpm docker:build
pnpm docker:run
curl http://localhost:3000/api/healthz
```

For API-only:

```bash
pnpm docker:build-api
```
