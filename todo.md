# Advanced JavaScript Challenge Site Roadmap

## Goal

Build an independent version of `advancedjavascript.org` inside this monorepo,
without Nextra, and turn it into an interactive flash-card challenge product.

The current task app is not important. Reuse the existing monorepo stack and
backend patterns, but replace the product with Advanced JavaScript docs,
challenges, saved progress, streaks, review queue, and topic readiness.

## Stack To Keep

- Monorepo: `pnpm`, Turborepo.
- API: Hono, TypeScript, Zod, `@hono/zod-openapi`, Prisma, PostgreSQL, `hono/jwt`.
- Web: Next.js App Router, React, TypeScript, MUI, MUI icons, SWR, axios,
  react-hook-form, zod/yup resolver, react-hot-toast.
- API contract: OpenAPI from Hono/Zod and generated TypeScript client through
  `packages/api-client`.
- Database: online PostgreSQL through `DATABASE_URL`.
- Deployment: existing API Docker/Yandex Cloud flow, web deploys separately.

## Product Direction

The site should have two connected surfaces:

- Public learning content copied from the existing Advanced JavaScript site.
- Authenticated challenge experience that saves user progress.

Main user workflow:

1. User reads JavaScript/TypeScript/React content.
2. User opens a related challenge deck.
3. User answers flashcards or code-output questions.
4. Anonymous user can try a short session locally.
5. Signed-in user saves attempts, streaks, review schedule, and topic readiness.
6. User returns later to review weak cards and continue a streak.

## Frontend Plan

Use `apps/web` as a custom Next.js App Router app. Do not use Nextra.

Routes:

```text
/
/docs
/docs/[...slug]
/challenge
/challenge/[deckSlug]
/review
/progress
/login
/account
```

Content:

- Copy the existing MDX/content manually into the monorepo.
- Keep frontmatter: title, description, sidebar title, tags where useful.
- Build custom docs navigation from a content manifest.
- Build custom article layout, table of contents, previous/next links, and code
  block styling.
- Keep docs readable without login.
- Link every flashcard back to the source article and heading.

UI:

- Use MUI for layout, navigation, dialogs, cards, tabs, chips, progress bars,
  tables, forms, tooltips, and icon buttons.
- Use SWR and the existing axios API wrapper for server state.
- Use react-hook-form for login/profile/challenge forms.
- Use toast feedback for saved progress, auth errors, and completed sessions.
- Keep first screen useful, not a marketing landing page.

## Backend Plan

Use `apps/api` and keep the existing feature structure:

```text
features/
  auth/
  users/
  content/
  decks/
  flashcards/
  challenge-sessions/
  reviews/
  progress/
```

Keep local patterns:

- `*.schemas.ts` for Zod validation.
- `*.openapi.ts` for route documentation.
- `*.controller.ts` for Hono routes.
- `*.service.ts` for business rules.
- `*.repository.ts` for Prisma access.
- JWT access tokens through the existing Hono/JWT style.
- `packages/api-client` regenerated after API changes.

## Auth Plan

Use custom auth in the Hono API. Do not use Auth.js, NextAuth, Clerk, Supabase
Auth, Passport, or OAuth wrapper libraries.

Supported methods:

- Email/password first, using the existing argon2 password hashing pattern.
- Google OAuth manually if practical.
- GitHub OAuth manually if practical.
- Email magic link only if an email delivery service is added later.

Manual OAuth requirements:

- Generate and validate `state`.
- Use PKCE where possible.
- Store short-lived OAuth login attempts.
- Exchange authorization code with provider token endpoint using `fetch`.
- Fetch provider profile and verified email.
- Link provider identity to an existing user by verified email only when safe.
- Store provider account IDs in a separate identity table.
- Issue the app's own JWT after successful login.
- Do not store provider access tokens unless a feature needs them.

Auth endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/google/start
GET  /api/auth/google/callback
GET  /api/auth/github/start
GET  /api/auth/github/callback
```

Needed env vars:

```text
AUTH_SECRET=
DATABASE_URL=
WEB_ORIGIN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Data Model

Replace task models with learning/challenge models.

Minimum Prisma models:

```text
User
  id
  fullName
  email
  password
  imageUrl
  role
  status
  createdAt
  updatedAt

AuthIdentity
  id
  userId
  provider
  providerAccountId
  email
  createdAt
  updatedAt

OAuthLoginAttempt
  id
  provider
  state
  codeVerifier
  redirectTo
  expiresAt
  createdAt

Article
  id
  slug
  title
  description
  section
  sourcePath
  order
  isPublished
  createdAt
  updatedAt

Deck
  id
  slug
  title
  description
  articleId
  order
  isPublished
  createdAt
  updatedAt

Flashcard
  id
  deckId
  slug
  type
  prompt
  code
  choicesJson
  answerJson
  explanation
  sourceSlug
  sourceHeading
  difficulty
  order
  isPublished
  createdAt
  updatedAt

ChallengeSession
  id
  userId
  deckId
  mode
  score
  totalCards
  correctCards
  startedAt
  completedAt

CardAttempt
  id
  sessionId
  userId
  flashcardId
  answerJson
  isCorrect
  responseMs
  createdAt

CardReview
  id
  userId
  flashcardId
  state
  ease
  intervalDays
  dueAt
  lastReviewedAt
  createdAt
  updatedAt

UserStreak
  id
  userId
  currentStreak
  longestStreak
  lastActivityDate
  updatedAt
```

Flashcard types:

```text
OUTPUT_PREDICTION
MULTIPLE_CHOICE
FILL_BLANK
ORDER_STEPS
TRUE_FALSE
CODE_REPAIR
```

## Useful Ideas From The Old Tender Todo

Keep the architecture ideas, not the tender domain:

- Documents -> articles/content sources.
- Chunks -> flashcards/questions.
- Analysis runs -> challenge sessions/readiness reports.
- Processing jobs -> optional card import jobs.
- Search/filter -> deck/topic/question discovery.
- Citations -> links from cards to source articles/headings.
- Fit score -> topic readiness score.

Drop:

- Tender metadata.
- PDF/DOCX upload.
- Object Storage for MVP.
- Redis worker for MVP.
- Vector search for MVP.
- LLM integration for MVP.

## MVP Delivery Plan

### Phase 1 - Monorepo Product Reset

- [ ] Replace task terminology in README/todo with Advanced JavaScript challenge
      terminology.
- [ ] Decide final app name and routes.
- [ ] Keep the existing API/web deployment flow.
- [ ] Remove task UI after the challenge shell exists.

Acceptance:

- The monorepo direction is clear.
- No new framework is introduced for docs/challenges.

### Phase 2 - Content Shell Without Nextra

- [ ] Copy Advanced JavaScript content into `apps/web`.
- [ ] Add a content manifest for sections, slugs, titles, and order.
- [ ] Build custom docs routes and article layout.
- [ ] Build sidebar/navigation and article table of contents.
- [ ] Preserve SEO metadata from content frontmatter.
- [ ] Add links from articles to related challenge decks.

Acceptance:

- Existing learning content is readable in the new app.
- No Nextra dependency is required.

### Phase 3 - Auth

- [ ] Adapt existing email/password auth for the new user model.
- [ ] Add `GET /api/auth/me`.
- [ ] Add custom Google OAuth flow.
- [ ] Add custom GitHub OAuth flow.
- [ ] Add account-linking rules.
- [ ] Add login/account UI.

Acceptance:

- User can sign in with email/password.
- User can sign in with Google and GitHub if provider setup is configured.
- The app issues its own JWT and stores progress under one user ID.

### Phase 4 - Flashcard MVP

- [ ] Create 30-50 curated cards from strongest topics:
      event loop, promises, `this`, call/bind/apply, arrays, objects, React.
- [ ] Seed decks and flashcards through Prisma.
- [ ] Add deck list endpoint.
- [ ] Add deck detail/cards endpoint.
- [ ] Add challenge session create/complete endpoints.
- [ ] Add attempt-save endpoint.
- [ ] Build `/challenge` and `/challenge/[deckSlug]`.

Acceptance:

- Anonymous users can try a short local session.
- Signed-in users have attempts saved.
- Each card links back to source content.

### Phase 5 - Progress And Review

- [ ] Add progress dashboard.
- [ ] Add user streak model and update logic.
- [ ] Add review queue.
- [ ] Implement simple spaced repetition buttons:
      `Again`, `Hard`, `Good`, `Easy`.
- [ ] Show weak topics and suggested next deck.

Acceptance:

- A signed-in user has a reason to return.
- Progress survives reloads and different devices.

### Phase 6 - Topic Readiness

- [ ] Compute readiness score by deck/topic.
- [ ] Show recent sessions and accuracy trends.
- [ ] Highlight failed cards and linked lessons.
- [ ] Add simple recommendations based on attempts.

Acceptance:

- User can see what they know and what to review next.
- Feedback works without AI.

### Phase 7 - Content Operations

- [ ] Add a simple script or seed format for adding cards.
- [ ] Validate card answer shape with Zod.
- [ ] Keep cards reviewable before publishing.
- [ ] Add optional card import job only if manual seeds become painful.

Acceptance:

- Adding new cards is repeatable.
- Bad card data fails validation before deployment.

### Phase 8 - Deployment And Quality

- [ ] Add Prisma migrations for the new schema.
- [ ] Run migrations against the online database.
- [ ] Regenerate API client after API changes.
- [ ] Add build/typecheck/test commands that CI can run.
- [ ] Update deployment docs for OAuth env vars and callback URLs.
- [ ] Verify deployed docs, auth, challenge, review, and progress flows.

Acceptance:

- Clean checkout builds.
- Deployed app supports public reading and authenticated progress.

## Can Wait

- AI-generated flashcards.
- Redis/background workers.
- Object Storage.
- PDF export.
- Full-text search beyond simple content/deck search.
- Admin UI for card publishing.
- Advanced analytics dashboards.

## Final Positioning

Use this as the main repo:

> A deployed Advanced JavaScript learning platform built with Next.js App Router,
> Hono, Prisma, PostgreSQL, custom OAuth/email auth, OpenAPI-generated TypeScript
> client, flashcard challenges, spaced repetition, saved progress, and topic
> readiness scoring.

