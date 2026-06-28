# Step-by-Step Implementation Plan

Work one step at a time. After each step, stop, test, and record the result before moving on.

## Step 1: Baseline And Contract Direction

### Todo

- Confirm current API and web builds still pass.
- Remove generated frontend client package from the active workspace.
- Confirm the target direction:
  - shared Zod schemas in `packages/schemas`
  - Swagger/OpenAPI remains inside `apps/api`
  - frontend uses direct fetchers + React Query, not generated API client/types

### Result

Clear contract direction before changing schema or auth.

```text
packages/shared-types  shared Zod schemas and inferred types
apps/api               imports schemas and exposes Swagger/OpenAPI
apps/web/src/api       fetchers and React Query hooks
generated client      removed
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

## Step 2: Add Shared Types Package And React Query Foundation

### Todo

- Make `apps/api` the clear owner of Swagger/OpenAPI.
- Remove the root generated API client command from the active workflow.
- Keep future API behavior checks as JetBrains/WebStorm `.http` request files, not unit tests.
- Add `packages/shared-types`.
- Use `tsdown` as the package build tool.
- Add watch script for better DX.
- Add shared schemas/types for:
  - health response
  - auth user/session shape
  - challenge DTOs
- Add React Query to `apps/web`.
- Add a single frontend API layer under `apps/web/src/api`.
- Fully type the health request first as the smallest vertical slice.

### Result

Shared schemas and frontend data fetching foundation exist before building larger challenge APIs.

Shared-types sub-step actual result:

- Added `packages/shared-types` as a compiled internal package.
- Used `tsdown` in unbundle mode so `dist` keeps the same feature-style folder structure as `src`.
- Copied API schemas into:
  - `packages/shared-types/src/shared/schemas.ts`
  - `packages/shared-types/src/features/health/health.schemas.ts`
  - `packages/shared-types/src/features/tasks/tasks.schemas.ts`
  - `packages/shared-types/src/features/users/users.schemas.ts`
- API now imports schemas and DTO types from `@repo/shared-types`.
- Deleted duplicated API schema files from `apps/api/src`.
- Aligned API/shared-types on `zod@4.4.3`.
- Removed old generated frontend client package.
- Dockerfiles now include and build `@repo/shared-types`.
- Schema declarations use manual DTO types plus compact schema exports so API type-checking stays fast.

Swagger/OpenAPI sub-step actual result:

- `apps/api` is now the clear owner of Swagger/OpenAPI.
- Hono app creation moved to `apps/api/src/app.ts`.
- `apps/api/src/server.ts` now only checks DB availability and starts the server.
- Canonical OpenAPI JSON URL is `http://localhost:8080/openapi.json`.
- Legacy `/doc` alias still works for now.
- Swagger UI reads from `/openapi.json`.
- Removed old generated-client script from the active workflow.
- README files now point to API-owned Swagger/OpenAPI.

### Test

```bash
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web build
```

Actual commands now:

```bash
pnpm --filter @repo/shared-types build
pnpm --filter api build
pnpm --filter web build
```

Manual:

- Open `http://localhost:8080/swagger`.
- Open `http://localhost:8080/openapi.json`.
- Open `http://localhost:3000/check-api`.
- Confirm health request still works.

Swagger/OpenAPI sub-step verified:

```text
pnpm --filter api build
GET http://localhost:8080/openapi.json -> 200 application/json
GET http://localhost:8080/doc          -> 200 application/json
GET http://localhost:8080/swagger      -> 200 text/html
```

## Step 3: Reshape Prisma Schema

### Todo

- Remove old todo domain:
  - `Task`
  - `Priority`
  - `Status`
- Reshape `User` for the product:
  - `email`
  - `fullName`
  - optional `avatarUrl`
  - optional `password`
  - `role`
  - `status`
- Add:
  - `OAuthAccount`
  - `GuestSession`
  - `Challenge`
  - `ChallengeOption`
  - `ChallengeAttempt`
  - `ChallengeProgress`
  - `ChallengeStatus`
- Create a destructive dev migration. Old todo data is not worth preserving.

### Result

Database schema matches the challenge product and no longer models todos.

### Test

```bash
pnpm db:up
pnpm db:migrate:dev
pnpm prisma:generate
pnpm --filter api build
```

Optional inspection:

```bash
pnpm --filter api exec prisma studio
```

## Step 4: Remove Old Todo API Surface

### Todo

- Remove old task feature files from `apps/api/src/features/tasks`.
- Remove task router registration.
- Remove task-specific schemas/services/repositories.
- Keep health and users/auth only.
- Remove old task frontend leftovers if still present.

### Result

The backend is no longer half todo app, half challenge app.

### Test

```bash
pnpm --filter api build
pnpm --filter web build
curl http://localhost:8080/api/healthz
```

## Step 5: Hono-Native Google Auth And Profile Control

### Todo

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
  - find/create user
  - create/link `OAuthAccount`
  - attach existing `GuestSession` progress to user
  - set existing `accessToken` cookie
  - redirect to `/challenges`
- Add a dismissible top-right auth prompt on `/challenges` only for unauthorized users.
- Prompt contains a Google auth button.
- Authenticated users should not see this prompt.
- User can close/dismiss the prompt and continue practicing as guest.
- Do not do background/silent Google authorization.
- OAuth redirect happens only after the user clicks the Google button or reaches the 50-answer auth gate.
- Keep auth checks fast: validate token first; fetch full user only when endpoint logic needs DB user state.

### Result

User can authorize with Google, profile state is visible in the UI, and protected/optional-auth API paths can identify the user.

### Test

```bash
pnpm --filter api build
pnpm --filter web build
pnpm dev
```

Manual:

- Open `http://localhost:3000/login`.
- Click Google login.
- Complete Google flow.
- Confirm redirect to `/challenges`.
- Confirm profile icon reflects auth state.
- Check `/api/me` from browser or curl with cookie.

## Step 6: Challenge Management API For Swagger

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

- Challenge shape should support existing course content and `console.log(...)` style tasks:
  - `topicSlug`
  - `title`
  - `prompt`
  - `code`
  - 3 options
  - one correct option
  - feedback per option
- No admin UI for now. Add/manage challenges through Swagger.

### Result

Challenges can be added to the DB manually through Swagger without seeds or admin UI.

### Test

```bash
pnpm --filter api build
pnpm dev
```

Manual:

- Open `http://localhost:8080/swagger`.
- Create one challenge.
- Verify it exists in Prisma Studio or via a temporary list endpoint if implemented.

## Step 7: Public Challenge Session API With Guest Progress

### Todo

- Add optional-auth/guest-aware endpoints:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/session?mode=practice
GET  /api/challenges/session?mode=review
POST /api/challenges/:id/answer
```

- Create/read `GuestSession` from cookie for anonymous users.
- Save all attempts for both guests and users.
- Update `ChallengeProgress` after each answer:
  - correct count
  - wrong count
  - status
  - next review timing
  - last answered time
- Return enough data for dashboard and challenge player.

### Result

Users can practice without auth, and their progress persists through a guest cookie.

### Test

```bash
pnpm --filter api build
pnpm dev
```

Manual:

- Create a challenge in Swagger.
- Open dashboard/session endpoints without logging in.
- Answer challenge.
- Refresh and confirm progress persists.
- Check guest session/progress rows in Prisma Studio.

## Step 8: Login UI And 50-Challenge Auth Gate

### Todo

- Add `/login`.
- Add "Continue with Google".
- Redirect logged-in users to `/challenges`.
- On `/challenges`, show the dismissible Google auth prompt only for guest/unauthorized users.
- Let guests practice until 50 answered challenges.
- After 50 answers, block further practice and ask for Google auth.
- After login, attach guest progress to the user and continue.

### Result

The app supports the intended acquisition flow: start immediately, require auth only after enough value has been shown.

### Test

- Practice as guest.
- Confirm progress saves.
- Simulate/reach 50 answered challenges.
- Confirm auth gate appears.
- Log in with Google.
- Confirm progress is still present under the user.

## Step 9: Challenges Dashboard UI

### Todo

- Replace placeholder quiz with the product dashboard.
- Choose and document styling approach/libraries before implementation.
- Show:
  - greeting
  - today progress
  - practice count
  - review count
  - topic progress
  - profile control
- Add buttons:
  - Practice
  - Review

### Result

`/challenges` is the main learning dashboard and matches the reference direction without copying it blindly.

### Test

```bash
pnpm --filter web build
```

Manual:

- Open `/challenges`.
- Confirm dashboard loads from API.
- Confirm guest/auth states render correctly.
- Practice/review buttons route correctly.

## Step 10: Challenge Session UI

### Todo

- Add `/challenges/practice`.
- Add `/challenges/review`.
- Implement challenge player:
  - prompt
  - code block
  - answer options
  - green/red feedback
  - explanation
  - next button
  - progress bar
  - close button
- Use React Query mutations for answers.

### Result

User can complete practice and review sessions with saved progress.

### Test

- Start practice.
- Answer correct and incorrect options.
- Refresh and confirm progress persisted.
- Start review and confirm missed/due challenges appear.
- Confirm auth gate after 50 guest answers.

## Step 11: Confirm Generated Client Removal

### Todo

- Confirm generated-client references are gone from docs/workflows.
- Confirm web uses shared schemas and local API fetchers.

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
- Update README if commands changed.
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
