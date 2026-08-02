# advancedjavascript.org

Advanced JavaScript documentation site built with Next.js, React, Fumadocs, MDX, TypeScript, Tailwind CSS, and pnpm.

The site teaches JavaScript behavior through focused articles, executable examples, and a planned flashcard practice product backed by the API.

## Getting Started

Use Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

```bash
pnpm dev          # start the Next.js dev server
pnpm build        # build the production app
pnpm start        # serve a production build
pnpm types:check  # generate Fumadocs/Next types, then run TypeScript
pnpm lint         # run ESLint
```

## Project Structure

- `content`: MDX documentation pages.
- `src/app/(home)/page.tsx`: homepage with runnable JavaScript snippets.
- `src/app/(home)/[...slug]`: root-level documentation routes, for example `/array-methods`.
- `src/app/challenges/page.tsx`: current transitional flashcard practice/review UI wired to `/api/challenges/*`.
- `src/app/check-auth/page.tsx`: temporary auth verification page for Google OAuth and `/api/me`.
- `src/app/snippet-test/page.tsx`: temporary admin-auth rendering playground and seed UI for snippets/challenges.
- `src/app/snippet-test/seed-challenges.ts`: temporary challenge seed payload posted to `/api/challenges`.
- `/flashcards`: future target route family for the separated flashcard dashboard/player UX.
- `src/api/challenges.ts`: typed frontend wrapper for public challenge practice endpoints.
- `src/app/api/search/route.ts`: Fumadocs search route handler.
- `src/app/og/[...slug]/route.tsx`: Open Graph image route for docs pages.
- `src/components/code-runner.tsx`: client-side CodeMirror and Sandpack runner.
- `src/components/snippet-code-runner.tsx`: server component that loads files from `src/snippets`.
- `src/components/markdown.tsx`: Markdown renderer used for processed documentation text.
- `src/lib/source.ts`: Fumadocs source loader and page helpers.
- `src/lib/shared.ts`: app name, route constants, and GitHub config.
- `source.config.ts`: Fumadocs MDX collection configuration.

Generated directories such as `.next`, `.source`, and `node_modules` are not source files.

## Content

Add and edit documentation pages as MDX files under `content`. Keep frontmatter titles and descriptions aligned with the page H1, first paragraph, and section headings.

After adding or moving MDX pages, run:

```bash
pnpm types:check
```

## Dependency Notes

The current app uses Fumadocs, Next.js, React, Tailwind, CodeMirror, Sandpack, and supporting TypeScript/ESLint tooling.

Product direction:

- User-facing practice copy should say flashcards.
- Backend/API contracts intentionally use `Challenge*` naming and `/api/challenges/*`.
- Reusable code snippets are backend `ChallengeSnippet` records and should be rendered as the code context for one or more challenge questions.
- Public player code should be runnable with snippet code first and challenge-specific code second.
- The current `/challenges` UI uses SWR and `src/api/challenges.ts`; keep API calls behind typed wrappers under `src/api`.
- Mock challenge data should stay removed from the practice UI.
- Root `challenges/*.md` files are content drafts for one snippet plus one or more console-output challenges.
- Root `challenges/seed-snippets.ts` is the reusable snippet seed payload used by `pnpm seed`.
- Root `challenges/separate-challenges/*.ts` files are generated one-challenge-per-file drafts. They should not import shared types, should use persisted `snippetId` values, and should not repeat the reusable snippet code at the top.
- Use `/snippet-test` only as a temporary admin seed tool for challenges. Reusable snippets are seeded with `pnpm seed`.
- If challenge seeding fails with missing snippets, verify the snippet IDs in `seed-challenges.ts` still match the persisted IDs in `challenges/saved-snippets.ts`.
- Dashboard stats shown in `/challenges` are current card states, not raw answer attempts: right means answered and not currently in review; wrong means currently needs review.
- Use Fumadocs code rendering, currently `fumadocs-ui/components/dynamic-codeblock`, for snippet code styling.
- Use the shared client `fetchers` object from `src/lib/fetchers.ts` for API calls.
- Google OAuth is the only auth flow. Do not add local email/password login forms.
- Start OAuth with browser navigation to `/api/auth/google`; do not start it with `fetch`, because Google redirects are cross-origin browser navigations.

The package manifest also includes libraries that are not directly imported anywhere in the current source tree:

- `@ai-sdk/react`
- `@openrouter/ai-sdk-provider`
- `@radix-ui/react-presence`
- `ai`
- `flexsearch`
- `lucide-react`
- `zod`
- `prettier`

These libraries are only imported by local files that are currently not referenced by the app:

- `class-variance-authority` in `src/components/ui/button.tsx`
- `hast-util-to-jsx-runtime`, `remark`, `remark-gfm`, `remark-rehype`, and `unist-util-visit` in `src/components/markdown.tsx`

Some packages may be intended peer/runtime support for Fumadocs or planned features, so verify before removing them.
