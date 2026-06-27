# advancedjavascript.org

Advanced JavaScript documentation site built with Next.js, React, Fumadocs, MDX, TypeScript, Tailwind CSS, and pnpm.

The site teaches JavaScript behavior through focused articles and executable examples for arrays, promises, the event loop, data structures, utility functions, sorting, SOLID, composition, and interview-style edge cases.

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
- `src/app/api/search/route.ts`: Fumadocs search route handler.
- `src/app/og/[...slug]/route.tsx`: Open Graph image route for docs pages.
- `src/components/home-code-runner.tsx`: client-side CodeMirror and Sandpack runner.
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
