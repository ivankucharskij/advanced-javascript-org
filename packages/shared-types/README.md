# Shared Types

Compiled internal package for shared Zod schemas and inferred TypeScript types.
Consumers import from the single public entry point:

```ts
import { taskSchema, type Task } from "@repo/shared-types";
```

```bash
pnpm --filter @repo/shared-types build
pnpm --filter @repo/shared-types dev
```
