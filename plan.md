# Flashcards Product Plan

Build this as the main portfolio product: a Google-auth-backed JavaScript flashcard practice app using existing course topics/content. The old todo/task domain is disposable and should stay removed.

## Product Shape

- Main experience is an endless flashcard practice flow, not a challenge list.
- Content target is roughly 250-300 JavaScript flashcards.
- Each flashcard has:
  - instruction/prompt text
  - code snippet, usually `console.log(...)` or a small JS fragment
  - 3 answer options
  - one correct option
  - feedback/explanation
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
- Use React Query in `apps/web`.
- Keep frontend API requests in one place under `apps/web/src/api`.

Target shape:

```text
packages/shared-types  shared Zod schemas and inferred types
apps/api               imports schemas, exposes Swagger/OpenAPI
apps/web/src/api       fetchers and React Query hooks
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
12. Redirect to the flashcard practice experience.

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
```

Auth:

```text
GET /api/me
GET /api/auth/google
GET /api/auth/google/callback
```

Content management through Swagger, no admin UI for now:

```text
POST   /api/challenges
PATCH  /api/challenges/:id
DELETE /api/challenges/:id
```

## Prisma Shape

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
/flashcards          dashboard / entry point
/flashcards/practice endless practice flow
/flashcards/review   wrong-card review flow
/login               Google login
```

Also add a dismissible auth prompt:

- Show Google auth prompt only for guests.
- Authenticated users should not see this prompt.
- User can dismiss it until the 50-answer gate.
- Do not do background/silent Google authorization.
- OAuth redirect happens only after the user clicks Google or reaches the auth gate.

## First Implementation Slice

1. Shared schemas + React Query direction.
2. Replace Prisma schema with the flashcard product schema.
3. Create destructive dev migration.
4. Remove old todo API surface.
5. Replace old users/email-password feature with Google-only auth and `/api/me`.
6. Add Swagger endpoints to create/manage challenges/flashcards.
7. Implement public/optional-auth challenge API with guest progress.
8. Implement endless practice and wrong-card review UI.
9. Add auth gate after 50 answered flashcards.

## Portfolio Value

Shows real product architecture: Google OAuth, guest-to-user progress merge, custom auth cookies, Prisma modeling, destructive domain reshape, shared Zod contracts, React Query, Swagger-managed content, optional/protected APIs, wrong-card review, saved progress, Docker, CI/CD, and polished educational UX.
