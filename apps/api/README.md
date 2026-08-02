# API

## Overview

`apps/api` is a Hono-based API server with:

- `@hono/zod-openapi` for typed routes and OpenAPI generation
- `@hono/swagger-ui` for interactive docs
- auth middleware for protected routes
- YDB-backed persistence owned by the API package

## Run

From the repo root:

```bash
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate
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

- OpenAPI JSON: `/api/openapi.json`
- OpenAPI document route: `/api/doc`
- Swagger UI: `/api/swagger`

## Database

Local development uses YDB from `infra/db.compose.yml`; migrations are Goose YQL files in `apps/api/db/migrations`.

```bash
pnpm db:up
pnpm db:migrate
pnpm db:status
```

## Docker

Build the API image from the repo root:

```bash
docker build -f infra/api.Dockerfile -t advanced-javascript-org-api .
```

Run it locally:

```bash
docker run --env-file apps/api/.env -p 8080:8080 advanced-javascript-org-api
```

When using Docker `--env-file`, keep values unquoted. For host-local YDB from inside a Docker container, use `host.docker.internal`:

```env
DB_CONNECTION_STRING=grpc://host.docker.internal:2136/local
```

## Structure

Core files:

- `src/app.ts` - Hono app, middleware, routes, Swagger/OpenAPI
- `src/server.ts` - database check and server bootstrap
- `src/router.ts` - top-level feature router mounting
- `src/config/openapi.ts` - OpenAPI document metadata

Feature folders:

- `src/features/health`
- `src/features/admin`
- `src/features/auth`
- `src/features/guest-sessions`
- `src/features/challenge-snippets` reusable code snippet CRUD
- `src/features/challenges` challenge/question CRUD for the flashcard UX

Feature modules use resource-prefixed files:

- `*.controller.ts` - Hono routes and HTTP response mapping
- `*.service.ts` - business rules and authorization decisions
- `*.repository.ts` - database access
- `*.schemas.ts` - request/response validation types
- `*.openapi.ts` - route definitions for OpenAPI generation

YDB query notes:

- User-facing text sorts should order by `Unicode::ToLower(...)` expressions so mixed-case titles/slugs sort naturally.
- Keep dynamic sort expressions restricted to hardcoded field maps before passing them to `unsafe(...)`.

Shared API helpers:

- `src/middleware/admin.ts`
- `src/middleware/auth.ts`
- `src/shared/http.ts` - HTTP statuses, typed results/bodies, and OpenAPI JSON content helper
- `src/shared/constants.ts` - shared API constants such as auth cookie settings

Shared request/response schemas live in:

- `packages/shared-types/src`

## Auth

Protected routes use `src/middleware/auth.ts`.

That middleware:

- reads the bearer token from `Authorization` or the `accessToken` cookie
- resolves the current user through `authService.authorize(...)`
- stores the user on `c.var.currentUser`

Auth is Google-only:

- Keep `/api/me`, `/api/auth/google`, and `/api/auth/google/callback`.
- Do not add custom email/password register/login.
- `User` is the internal learner/account row.
- `OAuthAccount` links the Google identity to `User`.
- `GET /api/auth/google` starts OAuth and must be opened as browser navigation, not Swagger `Execute`.
- `GET /api/auth/google/callback` validates the Google profile, upserts the user, links `OAuthAccount`, sets the `accessToken` cookie, and returns the shared `googleCallbackResponseSchema` response.
- Local Google token exchange can fail if Node cannot reach `https://oauth2.googleapis.com/token`; this is reported as `502`.

Admin routes use a separate admin bearer token for Swagger-friendly content management:

- `POST /api/admin/session` accepts `{ "code": "<ADMIN_CODE>" }`.
- The response includes an admin `accessToken` that expires after 12 hours.
- In Swagger, authorize admin routes with the returned token under `adminBearerAuth`.
- Admin tokens are separate from Google user tokens and are only valid for admin-protected routes.

## Challenges / Flashcards

The product UX is flashcards, but backend/schema naming intentionally uses `Challenge*`.

Current content authoring model:

- `ChallengeSnippet` stores reusable code: `slug`, `topicSlug`, `title`, `language`, and `code`.
- `Challenge` stores a question and points at a snippet through `snippetId`.
- Multiple challenges can reference the same snippet.
- Keep snippet content drafts in root `challenges/snippets.md` while editing manually.
- Keep per-snippet challenge drafts in root `challenges/*.md`. Each file preserves one snippet section and appends one to four console-output challenge drafts.
- `challenges/seed-snippets.ts` contains the reusable snippet seed payload used by `pnpm seed`.
- `challenges/saved-snippets.ts` stores persisted snippet IDs from the temporary admin seed flow.
- `challenges/separate-challenges/*.ts` contains generated one-challenge-per-file seed drafts. They use `snippetId`, omit reusable snippet code, keep only challenge-specific `code` or `null`, and do not import shared types.
- Temporary challenge seed data for the web admin playground lives in `apps/web/src/app/snippet-test/seed-challenges.ts`.
- Public practice responses combine runnable code as `ChallengeSnippet.code` first, then `Challenge.code` second when challenge-specific code exists.
- Shared pagination caps list `limit` at 100.

Current CRUD routes:

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

These CRUD routes require `adminBearerAuth`.

Current public optional-auth practice routes:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice
GET  /api/challenges/next?mode=review
POST /api/challenges/:id/answer
POST /api/challenges/restart
```

Public practice routes identify the actor from a bearer token or `accessToken` cookie when present. Otherwise they create or reuse a `guestSessionId` cookie.

Progress is stored in `ChallengeProgress`, not attempt history:

- `needsReview`: true after a wrong answer, false after a correct answer.
- `answeredCount`: incremented on every answer.
- `correctCount`: incremented on correct answers.
- Dashboard totals are current card-state counts: `totalAnswered` is answered
  cards, `totalCorrect` is answered cards not currently needing review, and
  `totalWrong` is the current review count.

There is no `ChallengeAttempt`, difficulty, user role/admin, user status/blocking, or local password field.

Guest sessions are temporary anonymous progress buffers. On Google login, merge current guest progress into the authenticated user and discard the guest session.

## Environment

See:

```text
apps/api/.env.example
```

Main variables:

- `PORT`
- `ADMIN_CODE`
- `AUTH_SECRET`
- `WEB_ORIGIN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `DB_CONNECTION_STRING`
- `GOOSE_DRIVER`
- `GOOSE_DBSTRING`
- `GOOSE_MIGRATION_DIR`
- `GOOSE_TABLE`

Run this before deploying the API container to apply existing migrations to the configured YDB database:

```bash
pnpm db:migrate
```

## Seed

Run the seed command from the repo root:

```bash
pnpm seed
```

The seed command does not create demo email/password users. Auth users are created through Google OAuth.

The seed command loads `challenges/seed-snippets.ts`, validates each item with the shared `createChallengeSnippetSchema`, inserts missing reusable snippets, and skips duplicate slugs.

Temporary challenge seeding is still in the web app at `/snippet-test`:

1. Start `pnpm dev`.
2. Open `http://localhost:3000/snippet-test`.
3. Authorize with `ADMIN_CODE`.
4. Click "Add challenges".

Challenge seeding posts each item to `/api/challenges`, treats duplicate slugs as skipped, and reports created/skipped/failed counts.
