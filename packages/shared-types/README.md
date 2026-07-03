# Shared Types

Compiled internal package for shared Zod schemas and inferred TypeScript types.
Consumers import from the single public entry point:

```ts
import { challengeSchema, meResponseSchema, type Challenge } from "@repo/shared-types";
```

Current contract areas:

- `features/auth`: Google-authenticated profile contracts such as `/api/me` and the Google callback response.
- `features/challenges`: backend challenge contracts used to power the flashcard UX.
- `features/health`: health check response.
- `shared`: common response and pagination helpers.

Do not add task/todo schemas or generated frontend API client types.

```bash
pnpm --filter @repo/shared-types build
pnpm --filter @repo/shared-types dev
```
