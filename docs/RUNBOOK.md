# advanced-javascript-org Runbook

This file is the handoff document for local development, Docker, database migrations, and deployment.

## Repository Map

```text
apps/api                 Hono API, database repositories, Goose migrations, Swagger/OpenAPI
apps/web                 Next.js app
packages/shared-types    compiled shared Zod schemas and inferred types
infra/Dockerfile         combined web + API image
infra/api.Dockerfile     API-only image for local/debug use
infra/db.compose.yml     local database service backed by YDB
.github/workflows/deploy-yc.yml
```

## Local Development

Requirements:

- Node.js 22 recommended
- pnpm 9
- Docker
- Goose CLI available on `PATH`

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
ADMIN_CODE=<local admin code for Swagger admin sessions>
WEB_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
DB_CONNECTION_STRING=grpc://localhost:2136/local
GOOSE_DRIVER=ydb
GOOSE_DBSTRING=grpc://localhost:2136/local?go_query_mode=scripting&go_fake_tx=scripting&go_query_bind=declare,numeric
GOOSE_MIGRATION_DIR=apps/api/db/migrations
GOOSE_TABLE=goose_db_version
```

Start local YDB:

```bash
pnpm db:up
```

Apply local migrations and seed data:

```bash
pnpm db:migrate
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
Swagger:          http://localhost:8080/api/swagger
OpenAPI JSON:     http://localhost:8080/api/openapi.json
YDB UI:           http://localhost:9876
Auth check page:  http://localhost:3000/check-auth
Challenges UI:    http://localhost:3000/challenges
Snippet test:     http://localhost:3000/snippet-test
```

The local compose file maps host `9876` to the YDB container UI port `8765`
because Windows may reserve host port `8765`.

`pnpm seed` validates and inserts reusable snippets from `challenges/seed-snippets.ts`, skips existing snippet slugs, and does not create demo email/password users. Auth users are created through Google OAuth.
`/check-auth` is the temporary auth verification page. It starts Google OAuth through browser navigation and checks `/api/me` with the auth cookie.

Product notes:

- User-facing practice UX is flashcards.
- Backend/API/schema naming intentionally uses `Challenge*` and `/api/challenges/*`.
- Reusable code snippets are stored as `ChallengeSnippet` records. `Challenge` records store questions and point to snippets through `snippetId`, so one snippet can have multiple questions.
- `challenges/snippets.md` is the manual working file for snippet content before turning it into database seed/import data.
- `challenges/seed-snippets.ts` is the reusable snippet seed payload used by `pnpm seed`.
- `challenges/*.md` contains one Markdown draft per snippet, including the copied snippet metadata/code and one or more console-output challenge drafts.
- `challenges/saved-snippets.ts` records persisted snippet IDs returned by the admin snippet import flow.
- `challenges/separate-challenges/*.ts` contains one generated challenge object per challenge draft. These objects use persisted `snippetId` values, omit the reusable top snippet code, include only challenge-specific `code` or `null`, and keep correct answers distributed across option positions.
- `apps/web/src/app/snippet-test/seed-challenges.ts` is the temporary web seed payload generated from `challenges/separate-challenges`.
- Auth is Google OAuth only: no local email/password registration/login.
- Guest sessions are temporary. On Google login, merge current guest progress into the authenticated user and discard the guest session.
- Progress is stored in YDB user/guest challenge progress tables with `needs_review`, `answered_count`, and `correct_count`; there is no answer-attempt history table.
- Dashboard totals are current card-state counts: `totalAnswered` is answered cards, `totalCorrect` is answered cards not currently needing review, and `totalWrong` is current review cards. `answeredCount` remains the internal attempt counter for the guest auth gate.
- Shared list pagination accepts `limit` values up to 100.
- Public practice endpoints are guest-aware and optional-auth:

```text
GET  /api/challenges/dashboard
GET  /api/challenges/next?mode=practice
GET  /api/challenges/next?mode=review
POST /api/challenges/:id/answer
POST /api/challenges/restart
```

Temporary challenge seeding lives at `http://localhost:3000/snippet-test`.
Authorize with `ADMIN_CODE`, then run "Add challenges".
The challenge seed flow posts to `/api/challenges`, treats duplicate slugs as skipped, and reports created/skipped/failed counts.

## Docker Local Run

The combined image runs Next.js as the public server on port `3000`; the API runs internally on port `8081`. Next proxies `/api/*` to the internal API.

Build and run:

```bash
pnpm docker:build
pnpm docker:run
```

`pnpm docker:run` uses `apps/api/.env`, but overrides Docker-specific values:

```text
PORT=3000
API_PORT=8081
LOCAL_API_URL=http://127.0.0.1:8081
DB_CONNECTION_STRING=grpc://host.docker.internal:2136/local
WEB_ORIGIN=http://localhost:3000
```

Check:

```bash
curl http://localhost:3000/api/healthz
```

Expected:

```json
{ "status": "healthy" }
```

## Database And Migrations

YDB is the only active database. Goose owns schema migrations from `apps/api/db/migrations`.

Development flow:

```bash
pnpm db:up
pnpm db:migrate
pnpm seed
```

Check migration status:

```bash
pnpm db:status
```

When changing schema:

1. Add a new Goose migration in `apps/api/db/migrations`.
2. Apply it locally with `pnpm db:migrate`.
3. Update database repository code and shared contracts if the HTTP shape changes.
4. Commit the migration and code together.

Rules:

- Do not edit already-applied migration files.
- Do not bake `DB_CONNECTION_STRING` or `AUTH_SECRET` into Docker images.
- Run migrations before deploying code that depends on new schema.
- Keep `GOOSE_DBSTRING` pointed at the same YDB database when applying migrations.
- For YDB-backed list endpoints, user-facing text sorts use `Unicode::ToLower(...)` in `ORDER BY` expressions. This keeps mixed-case values, for example `thisArg...`, in natural title order.

## Local Commands

```bash
pnpm dev
pnpm check
pnpm db:up
pnpm db:down
pnpm db:migrate
pnpm db:status
pnpm docker:build
pnpm docker:run
pnpm docker:build-api
pnpm docker:run-api
```

## Deployment Architecture

`advanced-javascript-org` deploys to Yandex Cloud as one Serverless Container built from `infra/Dockerfile`.

- Database: YDB.
- Runtime: Yandex Cloud Serverless Containers.
- Public server: Next.js on `PORT`, `8080` in Yandex Cloud.
- Internal API: Hono on `API_PORT`, `8081` in Yandex Cloud.
- API routing: Next.js rewrites `/api/*` to `LOCAL_API_URL`, `http://127.0.0.1:8081` in Yandex Cloud.

## Deploy Combined Container To Yandex Cloud

Registry currently used:

```text
crp5emfit56tmpg5qp5l
```

Required runtime env:

```text
AUTH_SECRET=<32+ character secret>
ADMIN_CODE=<admin code for Swagger admin sessions>
DB_CONNECTION_STRING=<YDB connection string>
WEB_ORIGIN=<public app HTTPS origin>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
GOOGLE_REDIRECT_URI=<public api callback URL>/api/auth/google/callback
API_PORT=8081
LOCAL_API_URL=http://127.0.0.1:8081
```

Migration env for the machine running Goose:

```text
GOOSE_DRIVER=ydb
GOOSE_DBSTRING=<YDB connection string with Goose query params when needed>
GOOSE_MIGRATION_DIR=apps/api/db/migrations
GOOSE_TABLE=goose_db_version
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
pnpm db:migrate
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
  --environment API_PORT=8081 \
  --environment LOCAL_API_URL="http://127.0.0.1:8081" \
  --environment ADMIN_CODE="<ADMIN_CODE>" \
  --environment AUTH_SECRET="<AUTH_SECRET>" \
  --environment DB_CONNECTION_STRING="<DB_CONNECTION_STRING>" \
  --environment WEB_ORIGIN="<WEB_ORIGIN>" \
  --environment GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>" \
  --environment GOOGLE_CLIENT_SECRET="<GOOGLE_CLIENT_SECRET>" \
  --environment GOOGLE_REDIRECT_URI="<GOOGLE_REDIRECT_URI>"
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
ADMIN_CODE
AUTH_SECRET
DB_CONNECTION_STRING
WEB_ORIGIN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
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

- In Docker, use `host.docker.internal` for host-local YDB.
- Check `DB_CONNECTION_STRING` points at the correct database path.
- Check `AUTH_SECRET` length is at least 32 characters.

`pnpm db:up` cannot bind port `8765`:

- Use the checked-in `infra/db.compose.yml`, which maps `9876:8765` for the
  YDB UI.
- If a failed start left a created container behind, remove it with
  `docker rm repo-db-local` and retry `pnpm db:up`.

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

- Check the Goose env points at the intended YDB database.
- Run locally against the same YDB connection:

```bash
pnpm db:status
```

Google OAuth callback returns `502 Google OAuth provider is unavailable` locally:

- The API exchanges the Google code server-side through Node `fetch` to `https://oauth2.googleapis.com/token`.
- If `curl https://oauth2.googleapis.com/token` works but Node `fetch` times out, the problem is local Node outbound networking, often VPN/firewall/DNS routing.
- Verify from the same shell with `node -e "fetch('https://oauth2.googleapis.com/token').then(r=>console.log(r.status)).catch(console.error)"`.
