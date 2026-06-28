# advanced-javascript-org Runbook

This file is the handoff document for local development, Docker, database migrations, and deployment.

## Repository Map

```text
apps/api                 Hono API, Prisma schema, migrations, Swagger/OpenAPI
apps/web                 Next.js app
packages/shared-types    compiled shared Zod schemas and inferred types
infra/Dockerfile         combined web + API image
infra/api.Dockerfile     API-only image for local/debug use
infra/postgres.compose.yaml
.github/workflows/deploy-yc.yml
```

## Local Development

Requirements:

- Node.js 22 recommended
- pnpm 9
- Docker

Install dependencies:

```bash
pnpm install
```

Create local API env if missing:

```bash
cp apps/api/.env.example apps/api/.env
```

Expected local `apps/api/.env` when running the API directly on the host:

```env
PORT=8080
AUTH_SECRET=local-dev-auth-secret-change-me-32-characters
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public
WEB_ORIGIN=http://localhost:3000
```

When running the API in Docker against the local Postgres compose service, use:

```env
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public
```

Start local Postgres:

```bash
pnpm db:up
```

Apply local migrations and seed data:

```bash
pnpm db:migrate:dev
pnpm seed
```

Run API and web in dev mode:

```bash
pnpm dev
```

Useful URLs:

```text
Web:              http://localhost:3000
API health:       http://localhost:8080/api/healthz
Swagger:          http://localhost:8080/swagger
OpenAPI JSON:     http://localhost:8080/openapi.json
API check page:   http://localhost:3000/check-api
```

Demo users after `pnpm seed`:

```text
admin@example.com / admin12345
user@example.com  / user12345
```

## Docker Local Run

The combined image runs Next.js as the public server on port `3000`; the API runs internally on port `8080`. Next proxies `/api/*` to the internal API.

Build and run:

```bash
pnpm docker:build
pnpm docker:run
```

`pnpm docker:run` uses `apps/api/.env`, but overrides Docker-specific values:

```text
PORT=3000
API_PORT=8080
LOCAL_API_URL=http://127.0.0.1:8080
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public
WEB_ORIGIN=http://localhost:3000
```

Check:

```bash
curl http://localhost:3000/api/healthz
```

Expected:

```json
{"status":"healthy"}
```

## Database And Migrations

Use one Prisma migration history for all environments.

Development flow:

```bash
pnpm db:up
pnpm db:migrate:dev
pnpm seed
```

When changing `apps/api/prisma/schema.prisma`:

```bash
pnpm db:migrate:dev
```

Commit both:

```text
apps/api/prisma/schema.prisma
apps/api/prisma/migrations/<timestamp_name>/migration.sql
```

Production/staging flow:

```bash
pnpm db:migrate:deploy
```

Rules:

- Use `migrate dev` only for local development.
- Use `migrate deploy` for Neon, CI, staging, and production.
- Do not edit already-applied migration files.
- Do not bake `DATABASE_URL` or `AUTH_SECRET` into Docker images.
- Run migrations before deploying code that depends on new schema.

## Local Commands

```bash
pnpm dev
pnpm check
pnpm db:up
pnpm db:down
pnpm db:logs
pnpm db:migrate:dev
pnpm db:migrate:deploy
pnpm docker:build
pnpm docker:run
pnpm docker:build-api
pnpm docker:run-api
```

## Deployment Architecture

`advanced-javascript-org` deploys to Yandex Cloud as one Serverless Container built from `infra/Dockerfile`.

- Database: Neon PostgreSQL.
- Runtime: Yandex Cloud Serverless Containers.
- Public server: Next.js on `PORT`.
- Internal API: Hono on `API_PORT`, default `8080`.
- API routing: Next.js rewrites `/api/*` to `LOCAL_API_URL`, default `http://127.0.0.1:8080`.

## Deploy Combined Container To Yandex Cloud

Registry currently used:

```text
crp5emfit56tmpg5qp5l
```

Required runtime env:

```text
AUTH_SECRET=<32+ character secret>
DATABASE_URL=<Neon PostgreSQL URL>
WEB_ORIGIN=<public app HTTPS origin>
API_PORT=8080
LOCAL_API_URL=http://127.0.0.1:8080
```

One-time setup:

```bash
yc init
yc container registry configure-docker
yc serverless container create --name advanced-javascript-org
yc iam service-account create --name advanced-javascript-org-sa
yc config get folder-id
yc iam service-account list
```

Grant image pull to the runtime service account:

```bash
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.puller \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>
```

Manual deploy:

```bash
pnpm db:migrate:deploy
docker build -f infra/Dockerfile -t cr.yandex/crp5emfit56tmpg5qp5l/advanced-javascript-org:latest .
docker push cr.yandex/crp5emfit56tmpg5qp5l/advanced-javascript-org:latest
```

Deploy revision:

```bash
yc serverless container revision deploy \
  --container-name advanced-javascript-org \
  --image cr.yandex/crp5emfit56tmpg5qp5l/advanced-javascript-org:latest \
  --service-account-id <SERVICE_ACCOUNT_ID> \
  --memory 512M \
  --cores 1 \
  --execution-timeout 30s \
  --concurrency 8 \
  --environment API_PORT=8080 \
  --environment LOCAL_API_URL="http://127.0.0.1:8080" \
  --environment AUTH_SECRET="<AUTH_SECRET>" \
  --environment DATABASE_URL="<DATABASE_URL>" \
  --environment WEB_ORIGIN="<WEB_ORIGIN>"
```

Allow public invocation once:

```bash
yc serverless container allow-unauthenticated-invoke advanced-javascript-org
yc serverless container get advanced-javascript-org
```

Test:

```bash
curl https://<container-url>/api/healthz
```

## GitHub Actions CI/CD

Workflow:

```text
.github/workflows/deploy-yc.yml
```

Triggers:

- Push to `main` when app, shared package, infra, or deployment files change.
- Manual `workflow_dispatch`.

It:

- installs Yandex Cloud CLI
- authenticates with service account JSON
- builds `infra/Dockerfile`
- pushes `cr.yandex/<registry-id>/advanced-javascript-org:<commit-sha>`
- deploys a new Serverless Container revision

GitHub repository variables:

```text
YC_REGISTRY_ID=crp5emfit56tmpg5qp5l
YC_CONTAINER_NAME=advanced-javascript-org
```

GitHub repository secrets:

```text
YC_SERVICE_ACCOUNT_KEY_JSON
YC_CLOUD_ID
YC_FOLDER_ID
YC_SERVICE_ACCOUNT_ID
AUTH_SECRET
DATABASE_URL
WEB_ORIGIN
```

The Actions service account needs these folder roles:

```text
container-registry.images.pusher
container-registry.images.puller
serverless-containers.editor
iam.serviceAccounts.user
```

Grant example:

```bash
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role serverless-containers.editor \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>
```

## Troubleshooting

`/api/healthz` returns 404 from web:

- Check `apps/web/next.config.mjs` has the `/api/:path*` rewrite.
- Rebuild/restart the Docker image after changing Next config.

API fails in Docker but local API works:

- In Docker, do not use `localhost` for host Postgres.
- Use `host.docker.internal` on Docker Desktop.
- Check `AUTH_SECRET` length is at least 32 characters.

Combined Docker image starts Next on the wrong port:

- `PORT` must be the public Next.js port.
- API internal port is `API_PORT`.
- `pnpm docker:run` already overrides this for local Docker.

Yandex Cloud app returns CORS errors:

- Set `WEB_ORIGIN` to the exact public app origin.
- Deploy a new container revision after changing env.

Yandex push auth fails:

```bash
yc container registry configure-docker
```

Migration fails in CI/prod:

- Check Neon `DATABASE_URL`.
- Run locally against the same URL:

```bash
pnpm --filter api exec prisma migrate status
```
