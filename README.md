# Advanced JavaScript

Advanced JavaScript is a full-stack learning app for practicing tricky JavaScript behavior through focused docs, runnable examples, and flashcard-style challenges.

The product is built as a portfolio-grade monorepo: a Next.js/Fumadocs documentation site, a Hono API, YDB persistence, shared Zod contracts, Google OAuth, guest progress, and Docker/Yandex Cloud deployment support.

## What It Does

- Teaches advanced JavaScript concepts with MDX documentation and executable code examples.
- Turns reusable JavaScript snippets into multiple flashcard questions.
- Lets visitors practice before signing in, then merges guest progress after Google OAuth.
- Tracks current flashcard state with review, answered, and correct counts.
- Exposes typed API contracts through a shared internal package instead of generated frontend clients.
- Ships as a combined production container with Next.js publicly proxying internal API routes.

## Engineering Highlights

- **Frontend:** Next.js 16, React 19, Fumadocs, MDX, Tailwind CSS, SWR.
- **Backend:** Hono, YDB, Goose migrations, Google OAuth, Swagger/OpenAPI.
- **Shared contracts:** Zod schemas and inferred TypeScript types in `packages/shared-types`.
- **Monorepo:** pnpm workspaces with Turborepo task orchestration.
- **Deployment:** Docker image for the web/API runtime, YDB, Yandex Cloud Serverless Containers, GitHub Actions CI/CD.

## Repository Map

```text
apps/web                 Next.js docs and flashcard UI
apps/api                 Hono API, database repositories, Goose migrations, Swagger/OpenAPI
packages/shared-types    shared Zod schemas and TypeScript types
infra                    Dockerfiles and local database compose file
docs/RUNBOOK.md          local dev, Docker, migrations, deploy, CI/CD
```

## Local Preview

Requirements: Node.js 22, pnpm 9, and Docker.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate
pnpm seed
pnpm dev
```

`pnpm seed` loads reusable snippet seed data from `challenges/seed-snippets.ts` and skips existing snippet slugs.

Useful local URLs:

- Web app: `http://localhost:3000`
- Flashcards: `http://localhost:3000/challenges`
- API health: `http://localhost:8080/api/healthz`
- Swagger UI: `http://localhost:8080/api/swagger`
- YDB UI: `http://localhost:9876`

## Documentation

- [Runbook](docs/RUNBOOK.md): local development, database, Docker, deployment, CI/CD, troubleshooting.
- [Web app notes](apps/web/README.md): frontend structure, content workflow, and temporary challenge seed UI.
- [API notes](apps/api/README.md): API structure, auth, database persistence, OpenAPI, flashcard contracts.
- [Container notes](infra/README.md): combined web/API image and runtime environment.
