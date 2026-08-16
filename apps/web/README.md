# Web App

`apps/web` is the Next.js 16 frontend for the Advanced JavaScript documentation and challenge-practice product. It uses React 19, Fumadocs, MDX, Tailwind CSS, SWR, CodeMirror, and Sandpack.

## Run And Verify

From the repository root:

```bash
pnpm --filter web dev
pnpm --filter web types:check
pnpm --filter web build
pnpm --filter web start
pnpm --filter web lint
```

`types:check` generates Fumadocs and Next.js route types before running TypeScript. The package `lint` script runs TypeScript and ESLint with fixes.

The app uses `LOCAL_API_URL` for its `/api/:path*` rewrite and defaults to `http://localhost:8080`. See `.env.example`.

## Routes

- `/`: homepage with runnable examples.
- Root lesson routes such as `/array-methods`: generated from `content/*.mdx`.
- `/challenges`: challenge dashboard.
- `/challenges/practice`: unanswered-challenge practice mode.
- `/challenges/review`: wrong-answer review mode.
- `/check-auth`: temporary Google OAuth and `/api/me` verification utility.
- `/snippet-test`: rendering playground and older admin-authorized seed UI.
- `/static-check-api`: diagnostic page.
- `/api/search`: Fumadocs search.
- `/og/[...slug]`, `/llms.mdx/[...slug]`, and `/sitemap.xml`: metadata/content routes.

There is no `/flashcards` route. Product copy and routes use challenge naming.

## Challenge UI

- `src/app/challenges/page.tsx`: dashboard with practice/review entry points, current session totals, guest save-progress prompt, and required-auth state.
- `src/app/challenges/_components/player.tsx`: shared practice/review player.
- `src/app/challenges/practice/page.tsx` and `review/page.tsx`: fixed-mode wrappers.
- `src/api/challenges.ts`: typed public challenge API wrapper.
- `src/lib/fetchers.ts`: shared `ky` helpers with cookies included.
- `src/components/code-runner.tsx`: runnable code editor and output.

The player shows the challenge title, prompt, combined runnable code, three answer options, answered/total progress, immediate answer feedback, and the correct answer after a wrong selection. Options lock after the first answer. Practice exhaustion can restart progress; review exhaustion returns to practice.

The dashboard intentionally does not display topic progress. The API currently returns topic aggregates, but the UI only presents practice/review counts and session totals.

Google OAuth starts through browser navigation to `/api/auth/google`; do not call that redirect route with `fetch`.

## Data Flow

The web app imports types from `@repo/shared-types` and uses local typed wrappers under `src/api`. SWR owns dashboard/session reads and answer/restart mutations. Do not generate a frontend client from OpenAPI and do not bypass `src/lib/fetchers.ts` for ordinary API calls.

`next.config.mjs` rewrites `/api/*` to `LOCAL_API_URL`. The combined Docker image depends on this to proxy browser requests to the internal Hono process.

## Documentation Content

- MDX lessons live in `content`.
- `src/app/(home)/[...slug]` serves root-level lesson routes.
- `src/lib/source.ts` configures the Fumadocs source.
- `source.config.ts` defines the MDX collection.
- `src/components/snippet-code-runner.tsx` loads runnable snippet files from `src/snippets`.
- `src/components/markdown.tsx` renders processed Markdown text.

After adding or moving MDX pages, run `pnpm --filter web types:check`.

## Challenge Content Utilities

- Root `challenges/*.md` files are source drafts.
- `challenges/seed-snippets.ts` is seeded with `pnpm seed`.
- `challenges/separate-challenges/*.ts` is seeded with `pnpm seed:challenges` after snippets exist.
- `challenges/saved-snippets.ts` contains the persisted snippet IDs referenced by challenge seed modules.
- `src/app/snippet-test/seed-challenges.ts` is the older browser-based seed payload used by `/snippet-test`.

Public runnable challenge code is reusable snippet code first and challenge-specific code second.

Generated directories (`.next`, `.source`, and `node_modules`) are not source files and must not be hand-edited.
