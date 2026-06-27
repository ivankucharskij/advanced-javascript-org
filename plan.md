# Challenges Product Plan

Build this as the main portfolio product: an auth-backed JavaScript coding challenge app inspired by the screenshots and existing course content. The old todo/task domain is disposable and should be removed.

## Product Shape

- Dashboard with greeting, today progress, practice count, review count, and topic progress.
- Practice mode for new coding challenges.
- Review mode for missed/due challenges.
- Challenge screen:
  - instruction text
  - code snippet, usually `console.log(...)` or a small JS fragment
  - 3 answer options
  - immediate green/red feedback
  - explanation for selected answer
  - progress bar and close button
- No streaks.
- No new chapters. Use existing course topics/content as the source of challenge topics.
- Users can start practicing without auth.
- After 50 answered challenges, require Google auth.
- Guest progress must still be saved and then attached to the user after login.

## Contract And Frontend Data

- Stop generating frontend API types from OpenAPI.
- `packages/shared-types` is the shared schema/type package.
- Add `packages/schemas` for shared Zod schemas and inferred TypeScript types.
- Use `tsdown` to build `packages/shared-types`.
- Add watch mode for good DX.
- Keep Swagger/OpenAPI inside `apps/api`.
- Use React Query in `apps/web`.
- Keep all frontend API requests in one place, with folder shape similar to backend features.

Target shape:

```text
packages/schemas       shared Zod schemas and inferred types
apps/api               imports schemas, exposes Swagger/OpenAPI
apps/web/src/api       React Query hooks and fetchers
```

## Auth

Use the Hono-native OAuth provider package:

```bash
pnpm --filter api add @hono/oauth-providers
```

Google routes:

```text
GET /api/auth/google
GET /api/auth/google/callback
GET /api/me
```

Flow:

1. User practices as guest.
2. Guest progress is saved under a guest session cookie.
3. After 50 answered challenges, UI requires auth.
4. User clicks "Continue with Google".
5. Hono Google middleware handles redirect/callback.
6. API receives Google profile.
7. Find or create `User`.
8. Link identity in `OAuthAccount`.
9. Move guest progress to the user.
10. Set existing `accessToken` cookie.
11. Redirect to `/challenges`.

Required env:

```text
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
```

Performance note:

- Authenticated challenge requests should be fast.
- Prefer validating the access token from the cookie.
- Fetch the full user only when endpoint logic actually needs DB user state.

## API

Public/optional-auth:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/session?mode=practice
GET  /api/challenges/session?mode=review
POST /api/challenges/:id/answer
```

Auth:

```text
GET /api/me
GET /api/auth/google
GET /api/auth/google/callback
```

Challenge management through Swagger, no admin UI for now:

```text
POST  /api/challenges
PATCH /api/challenges/:id
DELETE /api/challenges/:id
```

## Prisma Reshape

Remove old todo tables:

```prisma
model Task
enum Priority
enum Status
```

Target schema:

```prisma
model User {
  id        String     @id @default(uuid())
  fullName  String
  email     String     @unique
  avatarUrl String?
  password  String?
  role      UserRole   @default(USER)
  status    UserStatus @default(ACTIVE)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  oauthAccounts     OAuthAccount[]
  challengeAttempts ChallengeAttempt[]
  challengeProgress ChallengeProgress[]
  guestSessions     GuestSession[]

  @@index([role])
  @@index([status])
}

model OAuthAccount {
  id                String   @id @default(uuid())
  userId            String
  provider          String
  providerAccountId String
  email             String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@index([email])
}

model GuestSession {
  id        String   @id @default(uuid())
  userId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user              User? @relation(fields: [userId], references: [id])
  challengeAttempts ChallengeAttempt[]
  challengeProgress ChallengeProgress[]

  @@index([userId])
}

model Challenge {
  id          String   @id @default(uuid())
  slug        String   @unique
  topicSlug   String
  title       String
  prompt      String
  code        String
  difficulty  Int      @default(1)
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  options  ChallengeOption[]
  attempts ChallengeAttempt[]
  progress ChallengeProgress[]

  @@index([topicSlug, order])
  @@index([difficulty])
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

model ChallengeAttempt {
  id             String   @id @default(uuid())
  userId         String?
  guestSessionId String?
  challengeId    String
  optionId       String
  isCorrect      Boolean
  createdAt      DateTime @default(now())

  user         User?         @relation(fields: [userId], references: [id])
  guestSession GuestSession? @relation(fields: [guestSessionId], references: [id])
  challenge    Challenge     @relation(fields: [challengeId], references: [id])

  @@index([userId, createdAt])
  @@index([guestSessionId, createdAt])
  @@index([challengeId])
}

model ChallengeProgress {
  id             String          @id @default(uuid())
  userId         String?
  guestSessionId String?
  challengeId    String
  status         ChallengeStatus @default(NEW)
  correctCount   Int             @default(0)
  wrongCount     Int             @default(0)
  nextReviewAt   DateTime?
  lastAnsweredAt DateTime?

  user         User?         @relation(fields: [userId], references: [id])
  guestSession GuestSession? @relation(fields: [guestSessionId], references: [id])
  challenge    Challenge     @relation(fields: [challengeId], references: [id])

  @@unique([userId, challengeId])
  @@unique([guestSessionId, challengeId])
  @@index([userId, status])
  @@index([guestSessionId, status])
  @@index([userId, nextReviewAt])
  @@index([guestSessionId, nextReviewAt])
}

enum ChallengeStatus {
  NEW
  LEARNING
  REVIEW
  MASTERED
}

enum UserRole {
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  BLOCKED
}
```

## UI Routes

```text
/challenges           dashboard
/challenges/practice  new challenge session
/challenges/review    due review session
/login                google login
```

Also add a dismissible top-right auth prompt on `/challenges`:

- Show a small notification/prompt with a Google auth button only for unauthorized users.
- Authenticated users should not see this prompt.
- User can close/dismiss it and continue practicing as guest.
- Some unauthorized users will authorize immediately when starting challenges.
- Do not do background/silent Google authorization.
- OAuth redirect happens only after the user clicks the Google button or reaches the 50-answer auth gate.

## First Implementation Slice

1. Shared schemas + React Query direction.
2. Replace Prisma schema with the target product schema.
3. Create migration. Since old todo data is worthless, destructive migration is acceptable in dev.
4. Add Hono-native Google auth.
5. Add Swagger endpoints to create/manage challenges in DB.
6. Implement public/optional-auth challenge API with guest progress.
7. Replace current `/challenges` placeholder with dashboard and session UI.
8. Add auth gate after 50 answered challenges.

## Portfolio Value

Shows real product architecture: OAuth, guest-to-user progress migration, custom auth cookies, Prisma modeling, destructive domain reshape, shared Zod contracts, React Query, Swagger-managed content, migrations, optional/protected APIs, review scheduling, saved progress, Docker, CI/CD, and polished educational UX.
