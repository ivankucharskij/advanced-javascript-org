# Advanced JavaScript

Advanced JavaScript is a full-stack learning app for studying tricky JavaScript behavior through focused documentation, runnable examples, and challenge practice.

Visitors can practice without an account, review wrong answers, and keep their progress after signing in with Google. The project is also a portfolio example of a production-oriented TypeScript monorepo with shared runtime contracts, API documentation, database persistence, containers, and CI/CD.

## Product

- MDX lessons about arrays, promises, the event loop, data structures, utilities, and interview edge cases.
- Runnable CodeMirror/Sandpack examples.
- `/challenges`: progress dashboard and practice/review entry point.
- `/challenges/practice`: endless unanswered-challenge flow.
- `/challenges/review`: challenges currently marked for review.
- Guest progress with a 50-answer Google OAuth gate and guest-to-user merge.
- Swagger-managed reusable snippets and challenge content.

## Architecture

- **Web:** Next.js 16, React 19, Fumadocs, MDX, Tailwind CSS, SWR, CodeMirror, Sandpack.
- **API:** Hono, Zod OpenAPI, Swagger UI, Google OAuth.
- **Database:** YDB with Goose migrations.
- **Contracts:** shared Zod schemas and inferred TypeScript types from `packages/shared-types`.
- **Monorepo:** pnpm workspaces and Turborepo.
- **Deployment:** combined Next.js/Hono Docker image for Yandex Cloud Serverless Containers.

```text
apps/web                 Next.js documentation and challenge UI
apps/api                 Hono API, YDB repositories, migrations, OpenAPI
packages/shared-types    compiled shared Zod contracts
packages/eslint-config   shared ESLint configurations
challenges               content drafts and seed payloads
infra                    local YDB and Docker runtime files
docs/RUNBOOK.md          development, migration, Docker, and deploy operations
```

## Local Development

Requirements:

- Node.js 22 recommended
- pnpm 9
- Docker
- Goose CLI on `PATH`

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate
pnpm seed
pnpm seed:challenges
pnpm dev
```

Useful URLs:

- Web: `http://localhost:3000`
- Challenges: `http://localhost:3000/challenges`
- API health: `http://localhost:8080/api/healthz`
- Swagger UI: `http://localhost:8080/api/swagger`
- OpenAPI JSON: `http://localhost:8080/api/openapi.json`
- YDB UI: `http://localhost:9876`

## Common Commands

```bash
pnpm dev                 # run package development tasks
pnpm build               # build the monorepo through Turborepo
pnpm check               # build API and web
pnpm lint                # run package lint tasks
pnpm db:status           # show local Goose migration status
pnpm docker:build        # build the combined production image
pnpm docker:run          # run the combined image on localhost:3000
```

## Documentation

- [Runbook](docs/RUNBOOK.md): setup, environment, YDB, migrations, Docker, Yandex Cloud, CI/CD, and troubleshooting.
- [Web app](apps/web/README.md): routes, frontend architecture, challenge UI, and content workflow.
- [API](apps/api/README.md): endpoints, auth, data model, persistence, and seeding.
- [Shared types](packages/shared-types/README.md): shared contract package.
- [Infrastructure](infra/README.md): container and local YDB topology.
