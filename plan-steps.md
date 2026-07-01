# Step-by-Step Implementation Plan

Work one step at a time. After each step, stop, test, and record the result before moving on.

## Step 1: Baseline And Contract Direction

### Todo

- Confirm current API and web builds still pass.
- Remove generated frontend client package from the active workspace.
- Confirm the target direction:
  - shared Zod schemas in `packages/shared-types`
  - Swagger/OpenAPI remains inside `apps/api`
  - frontend uses direct fetchers + React Query, not generated API client/types

### Result

Clear contract direction before changing schema or auth.

```text
packages/shared-types  shared Zod schemas and inferred types
apps/api               imports schemas and exposes Swagger/OpenAPI
apps/web/src/api       fetchers and React Query hooks
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

## Step 2: Shared Types And React Query Foundation

### Todo

- Make `apps/api` the clear owner of Swagger/OpenAPI.
- Remove the root generated API client command from the active workflow.
- Keep future API behavior checks as JetBrains/WebStorm `.http` request files, not unit tests.
- Add/build `packages/shared-types` with `tsdown`.
- Add shared schemas/types for:
  - health response
  - auth profile / `/api/me`
  - flashcard DTOs
- Add React Query to `apps/web`.
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
  - redirect to `/flashcards`
- Keep auth checks fast: validate token first; fetch full user only when endpoint logic needs DB user state.

### Result

User can authorize with Google, profile state is visible through `/api/me`, and optional/protected API paths can identify the user.

Actual result so far:

- Old users/email-password feature was removed from active source.
- New auth feature skeleton exists with `/api/me` and token authorization.
- Google redirect/callback still need implementation.
- Next implementation work:
  - Add `@hono/oauth-providers` to `apps/api`.
  - Implement `GET /api/auth/google`.
  - Implement `GET /api/auth/google/callback`.
  - In the callback, read the Google profile, find/create `User`, link `OAuthAccount`, merge current guest progress into the user, delete/discard the guest session, clear the guest cookie, set the `accessToken` cookie, and redirect to `/flashcards`.
  - Keep the existing `GET /api/me` route.
- Before continuing, review and intentionally keep or revise the untracked migration folder:

```text
apps/api/prisma/migrations/20260630082212/
```

### Test

```bash
pnpm db:up
pnpm db:migrate:dev
pnpm prisma:generate
pnpm --filter api build
pnpm --filter web build
pnpm dev
```

Manual:

- Open `http://localhost:3000/login`.
- Click Google login.
- Complete Google flow.
- Confirm redirect to `/flashcards`.
- Confirm `/api/me` returns the authenticated profile.

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

### Test

```bash
pnpm --filter api build
pnpm dev
```

Manual:

- Open `http://localhost:8080/swagger`.
- Create one flashcard.
- Verify it exists in Prisma Studio or through a temporary list endpoint if implemented.

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

### Test

```bash
pnpm --filter api build
pnpm dev
```

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
- Use React Query mutations for answers.
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
