# API

`apps/api` is the Hono API for Advanced JavaScript. It owns Google OAuth, guest sessions, challenge content and progress, YDB persistence, shared-contract validation, and Swagger/OpenAPI.

## Run And Verify

From the repository root:

```bash
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api start
pnpm --filter api lint
```

The host-local API defaults to `http://localhost:8080`.

API documentation:

- Swagger UI: `/api/swagger`
- OpenAPI JSON: `/api/openapi.json`
- Additional OpenAPI document route: `/api/doc`

## Architecture

Core files:

- `src/app.ts`: Hono app, logging, CORS, Swagger, and OpenAPI registration.
- `src/server.ts`: Node server startup and graceful database-driver shutdown.
- `src/router.ts`: feature-router mounting.
- `src/config/env.ts`: runtime environment validation.
- `src/lib/db.ts`: YDB driver/query client and health query.
- `src/shared/http.ts`: typed result/status/OpenAPI JSON helpers.

Feature folders:

- `src/features/health`
- `src/features/admin`
- `src/features/auth`
- `src/features/guest-sessions`
- `src/features/challenge-snippets`
- `src/features/challenges`

Feature modules use controller/service/repository/OpenAPI separation. Request and response schemas come from `@repo/shared-types`; the API owns the Swagger document. Expected service failures are returned as typed HTTP results and explicit JSON responses rather than thrown as generic errors.

## Routes

Health and guest session:

```text
GET    /api/healthz
GET    /api/guest-session
POST   /api/guest-session
DELETE /api/guest-session
```

Google auth:

```text
GET /api/auth/google
GET /api/auth/google/callback
GET /api/me
```

Public optional-auth challenge flow:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice
GET  /api/challenges/next?mode=review
POST /api/challenges/:id/answer
POST /api/challenges/restart
```

Admin/content management:

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

Challenge/snippet management routes require the separate `adminBearerAuth` token issued by `POST /api/admin/session`. They are intended for Swagger/content workflows; there is no admin user role or admin UI.

## Auth And Guests

Google OAuth is the only user auth flow.

- `GET /api/auth/google` must be opened as browser navigation.
- The callback validates the Google profile, creates or updates the internal user/OAuth account, merges guest progress, discards the guest session, clears its cookie, and sets the `accessToken` cookie.
- `/api/me` accepts the auth cookie or bearer token.
- Auth/guest cookies are secure when `WEB_ORIGIN` is HTTPS and remain usable on local HTTP.
- There is no local registration, password, role, user status, or blocking model.

Public challenge requests resolve an authenticated user when possible. Otherwise they use a temporary `guestSessionId` cookie. Guests can answer up to 50 total attempts before the dashboard/session response requires Google auth.

## Challenge Model And Behavior

- `ChallengeSnippet` stores reusable code and metadata.
- `Challenge` stores one question and references its snippet through `snippetId`.
- Multiple challenges can share a snippet.
- Challenge-specific code may be null; public runnable code combines snippet code first and challenge code second.
- Every challenge has exactly three ordered options and exactly one correct option.
- Management responses include correctness metadata; public next-challenge responses do not.

Progress is current state rather than attempt history:

- `answeredCount` increments for every answer.
- Correct answers increment `correctCount` and clear `needsReview`.
- Wrong answers set `needsReview`.
- Practice mode returns unanswered challenges.
- Review mode returns challenges currently marked `needsReview`.
- `totalAnswered` counts challenges answered at least once.
- `totalCorrect` counts answered challenges not currently needing review.
- `totalWrong` and `reviewCount` represent the current review set.
- `practiceCount` represents unanswered challenges.
- Dashboard topic aggregates are returned by the API but are not currently rendered by the web dashboard.
- Restart deletes the current actor's progress rows.

There is no difficulty, streak, `ChallengeAttempt`, or answer-history table.

## YDB

YDB is the only database. Local YDB is defined by `infra/db.compose.yml`; Goose migrations live in `db/migrations`.

```bash
pnpm db:up
pnpm db:migrate
pnpm db:status
```

The current schema migration creates:

- `users`
- `oauth_accounts`
- `guest_sessions`
- `challenge_snippets`
- `challenges`
- `challenge_options`
- `user_challenge_progress`
- `guest_challenge_progress`

Repository code owns relation checks and cascades. User-facing text sorts use whitelisted `Unicode::ToLower(...)` expressions so mixed-case values sort naturally.

`GET /api/healthz` queries YDB and returns:

```json
{ "status": "healthy", "db": "ok" }
```

If YDB is unavailable, it returns HTTP 503 with:

```json
{ "status": "unhealthy", "db": "fail" }
```

The API process starts without an eager successful database connection; health and database-backed routes report availability at request time.

## Environment

Use `apps/api/.env.example` for host-local development.

Main runtime variables:

- `PORT`
- `ADMIN_CODE`
- `AUTH_SECRET`
- `WEB_ORIGIN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `DB_CONNECTION_STRING`
- `YDB_ANONYMOUS_CREDENTIALS` or `YDB_METADATA_CREDENTIALS`

Goose variables:

- `GOOSE_DRIVER`
- `GOOSE_DBSTRING`
- `GOOSE_MIGRATION_DIR`
- `GOOSE_TABLE`

Host-local application connection:

```text
grpc://localhost:2136/local
```

Host-local Goose connection:

```text
grpc://localhost:2136/local?go_query_mode=scripting&go_fake_tx=scripting&go_query_bind=declare,numeric
```

Use the uncommitted `apps/api/.env.production.local` and root `db:*:prod` commands for production migration status/apply. See `docs/RUNBOOK.md`.

## Seeding

Seed reusable snippets first, then challenges:

```bash
pnpm seed
pnpm seed:challenges
```

- `pnpm seed` loads `challenges/seed-snippets.ts` and validates with `createChallengeSnippetSchema`.
- `pnpm seed:challenges` loads the 85 modules in `challenges/separate-challenges`, validates with `createChallengeSchema`, and requires matching persisted snippet IDs.
- Both commands create missing rows, skip duplicate slugs, report counts, and fail on other errors.
- Auth users are never seeded; they are created through Google OAuth.

## Docker

The primary deployment artifact is the combined image in `infra/Dockerfile`. The API-only `infra/api.Dockerfile` remains available for local/debug use:

```bash
pnpm docker:build-api
pnpm docker:run-api
```

When an API container connects to host-local YDB, use `grpc://host.docker.internal:2136/local`.
