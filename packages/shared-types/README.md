# Shared Types

`@repo/shared-types` is the compiled internal contract package shared by the Hono API and Next.js web app. It exports Zod schemas and their TypeScript types from one public entry point.

```ts
import {
  challengeSchema,
  meResponseSchema,
  type Challenge,
} from "@repo/shared-types";
```

## Contract Areas

- `features/auth`: `/api/me` and Google callback contracts.
- `features/guest-sessions`: guest-session lifecycle contracts.
- `features/challenge-snippets`: reusable snippet CRUD contracts.
- `features/challenges`: challenge CRUD, dashboard, next-challenge, answer, progress, and restart contracts.
- `features/health`: health response.
- `shared`: errors and pagination.

There is no generated frontend client and no separate `Practice*` contract area. Do not add task/todo schemas or duplicate challenge-practice contracts.

## Challenge Conventions

- Public challenges contain exactly three answer options without correctness metadata.
- Management challenge responses include option correctness and feedback.
- Runnable code is returned with reusable snippet code first and challenge-specific code second.
- Dashboard totals represent current challenge state, not an attempt log.
- The dashboard response includes topic aggregates even though the current dashboard UI does not render them.
- Pagination defaults to 5 items and caps `limit` at 100.

## Commands

```bash
pnpm --filter @repo/shared-types build
pnpm --filter @repo/shared-types dev
pnpm --filter @repo/shared-types lint
```

`build` uses `tsdown` and writes `dist`; do not edit generated output manually.
