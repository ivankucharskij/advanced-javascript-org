# Fullstack Monorepo Runbook

This file is the handoff document for local development, Docker, database migrations, and deployment.

## Repository Map

```text
apps/api                 Hono API, Prisma schema, migrations, Swagger/OpenAPI
apps/web                 Next.js app
packages/shared-types    compiled shared Zod schemas and inferred types
infra/Dockerfile         combined web + API image
infra/api.Dockerfile     API-only image for Yandex API deployment
infra/postgres.compose.yaml
.github/workflows/deploy-api-yc.yml
Makefile
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

Expected local `apps/api/.env`:

```env
PORT=8080
AUTH_SECRET=local-dev-auth-secret-change-me-32-characters
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public
WEB_ORIGIN=http://localhost:3000
```

Start local Postgres:

```bash
make db-up
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
make build
make run
```

`make run` uses `apps/api/.env`, but overrides Docker-specific values:

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
make db-up
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

## Make Commands

```bash
make help
make db-up
make db-down
make db-logs
make build
make run
make build-api
make run-api
make push-api
make migrate
make check
```

## Deployment Architecture

Current deployment target:

- Database: Neon PostgreSQL.
- API: Yandex Cloud Serverless Containers, API-only image from `infra/api.Dockerfile`.
- Web: Vercel, project root `apps/web`.

There is also `infra/Dockerfile` for running web + API in one container. If deployed to Yandex as a combined app, Yandex should route to Next.js on `PORT`, with API internal on `API_PORT`.

## Deploy API To Yandex

Registry currently used:

```text
crp5emfit56tmpg5qp5l
```

Required Yandex API env:

```text
PORT=8080
AUTH_SECRET=<32+ character secret>
DATABASE_URL=<Neon PostgreSQL URL>
WEB_ORIGIN=<web app HTTPS origin>
```

One-time setup:

```bash
yc init
yc container registry configure-docker
yc serverless container create --name fullstack-api
yc iam service-account create --name fullstack-api-sa
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
docker build -f infra/api.Dockerfile -t cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest .
docker push cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest
```

Deploy revision:

```bash
yc serverless container revision deploy \
  --container-name fullstack-api \
  --image cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest \
  --service-account-id <SERVICE_ACCOUNT_ID> \
  --memory 512M \
  --cores 1 \
  --execution-timeout 30s \
  --concurrency 8 \
  --environment PORT=8080 \
  --environment AUTH_SECRET="<AUTH_SECRET>" \
  --environment DATABASE_URL="<DATABASE_URL>" \
  --environment WEB_ORIGIN="<WEB_ORIGIN>"
```

Allow public invocation once:

```bash
yc serverless container allow-unauthenticated-invoke fullstack-api
yc serverless container get fullstack-api
```

Test:

```bash
curl https://<container-url>/api/healthz
```

## Deploy Web To Vercel

Vercel settings:

```text
Project root: apps/web
Framework: Next.js
LOCAL_API_URL=https://<yandex-api-url>
NEXT_PUBLIC_SITE_URL=https://<vercel-domain>
```

After Vercel deploys:

1. Copy the Vercel origin, for example `https://your-app.vercel.app`.
2. Set API `WEB_ORIGIN` to that exact origin.
3. Deploy a new Yandex API revision.
4. Test auth/API calls from the Vercel domain.

## GitHub Actions CI/CD

Workflow:

```text
.github/workflows/deploy-api-yc.yml
```

Triggers:

- Push to `main` when API/deployment files change.
- Manual `workflow_dispatch`.

It:

- installs Yandex Cloud CLI
- authenticates with service account JSON
- builds `infra/api.Dockerfile`
- pushes `cr.yandex/<registry-id>/fullstack-api:<commit-sha>`
- deploys a new Serverless Container revision

GitHub repository variables:

```text
YC_REGISTRY_ID=crp5emfit56tmpg5qp5l
YC_CONTAINER_NAME=fullstack-api
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
- `make run` already overrides this.

Yandex API returns CORS errors:

- Set `WEB_ORIGIN` to the exact deployed web origin.
- Deploy a new API revision.

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
