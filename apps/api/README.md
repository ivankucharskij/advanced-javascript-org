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
pnpm prisma:generate
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

## Prisma

Generate the Prisma client from the repo root:

```bash
pnpm prisma:generate
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

When using Docker `--env-file`, keep values unquoted:

```env
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
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
- `*.repository.ts` - Prisma/database access
- `*.schemas.ts` - request/response validation types
- `*.openapi.ts` - route definitions for OpenAPI generation

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
- Keep snippet content drafts in the repo root `snippets.md` while editing manually.
- Keep per-snippet challenge drafts in root `challanges/*.md`. Each file preserves one snippet section and appends one to four console-output challenge drafts.
- `challanges/saved-snippets.ts` stores persisted snippet IDs from the temporary admin seed flow.
- `challanges/separate-challenges/*.ts` contains generated one-challenge-per-file seed drafts. They use `snippetId`, omit reusable snippet code, keep only challenge-specific `code` or `null`, and do not import shared types.
- Temporary seed data for the web admin playground lives in `apps/web/src/app/snippet-test/snippets.ts` and `apps/web/src/app/snippet-test/seed-challenges.ts`. Seed snippets before challenges.
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
- `DATABASE_URL`
- `WEB_ORIGIN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

Run this before deploying the API container to apply existing migrations to the configured database:

```bash
pnpm db:migrate:deploy
```

## Seed

Run the seed command from the repo root:

```bash
pnpm seed
```

The seed command does not create demo email/password users. Auth users are created through Google OAuth.

The temporary content seed workflow is in the web app at `/snippet-test`:

1. Start `pnpm dev`.
2. Open `http://localhost:3000/snippet-test`.
3. Authorize with `ADMIN_CODE`.
4. Click "Add snippets".
5. Click "Add challenges".

Challenge seeding posts each item to `/api/challenges`, treats duplicate slugs as skipped, and reports created/skipped/failed counts.
