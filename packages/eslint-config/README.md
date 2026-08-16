# ESLint Config

`@repo/eslint-config` contains the monorepo's shared ESLint configurations.

Exports:

- `@repo/eslint-config/base`: TypeScript packages and the Hono API.
- `@repo/eslint-config/next-js`: the Next.js web app.

The package centralizes TypeScript, React, React Hooks, Next.js, Turborepo, import sorting, unused-import, and Prettier compatibility rules. It has no build step; consuming packages run ESLint through their own `lint` scripts.
