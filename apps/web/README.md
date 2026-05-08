# Web App

## Overview

`apps/web` is the Next.js frontend in this workspace.

Current stack:

- Next.js App Router
- React 19
- generated API types from `@repo/api-client`

## Run

From the repo root:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
pnpm --filter web lint
```

Default local URL:

```text
http://localhost:3000
```

## Structure

Main source directory:

```text
apps/web/src
```

Layout:

```text
apps/web/src/
  app/               # Next.js routing only
  features/          # feature code
  lib/               # app/shared utilities
  assets/            # static assets imported by the app
  theme/             # MUI theme and design tokens
```

Current feature split:

```text
apps/web/src/features/auth/
  components/
  auth-form.schema.ts

apps/web/src/features/tasks/
  components/
  hooks/
  task-form.schema.ts
  task-labels.ts
  types.ts
```

Notable files:

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.js`
- `src/app/layout.tsx`
- `src/theme/theme.ts`

## API Integration

The web app is expected to talk to the API app in `apps/api`.

Useful API local URLs:

- API base: `http://localhost:8080`
- OpenAPI JSON: `http://localhost:8080/doc`
- Swagger UI: `http://localhost:8080/swagger`

The web app currently reads:

- `LOCAL_API_URL`

For local development, put it in `apps/web/.env.local`:

```env
LOCAL_API_URL=http://localhost:8080
```

## Vercel

Deploy `apps/web` as the Vercel project root.

Set this environment variable in Vercel:

```env
LOCAL_API_URL=https://<your-yandex-api-url>
```

The app uses Next.js rewrites, so browser requests go to `/api/*` on the Vercel domain and Vercel proxies them to the API URL above.

After Vercel creates the web domain, update the Yandex API `WEB_ORIGIN` environment variable to that exact origin and deploy a new API revision.
