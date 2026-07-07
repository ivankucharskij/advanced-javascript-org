# Shared Types

Compiled internal package for shared Zod schemas and inferred TypeScript types.
Consumers import from the single public entry point:

```ts
import { challengeSchema, meResponseSchema, type Challenge } from "@repo/shared-types";
```

Current contract areas:

- `features/auth`: Google-authenticated profile contracts such as `/api/me` and the Google callback response.
- `features/guest-sessions`: anonymous guest-session contracts used before Google login.
- `features/challenge-snippets`: reusable snippet CRUD contracts.
- `features/challenges`: challenge/question contracts used to power the flashcard UX, including dashboard, next-card, answer, and restart responses.
- `features/health`: health check response.
- `shared`: common response and pagination helpers.

Do not add task/todo schemas or generated frontend API client types.

Challenge response conventions:

- Public player code is returned as runnable code: reusable snippet first, challenge-specific code second.
- Dashboard `totalWrong` means current review cards (`needsReview = true`), not historical wrong attempts.
- Restart responses report how many progress rows were cleared for the current user or guest.

```bash
pnpm --filter @repo/shared-types build
pnpm --filter @repo/shared-types dev
```
