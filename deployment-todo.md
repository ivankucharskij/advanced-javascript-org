# Deployment Todo

## Target Architecture

- [ ] API runs in Yandex Cloud Serverless Containers.
- [ ] API image is built from `apps/api/Dockerfile`.
- [ ] API image is stored in Yandex Container Registry.
- [ ] Database is external PostgreSQL, currently Neon.
- [ ] Web will be deployed separately and will call the API HTTPS URL.

## API Runtime Environment

Set these env vars on the Yandex Serverless Container revision:

- [ ] `PORT=8080`
- [ ] `AUTH_SECRET=<32+ character secret>`
- [ ] `DATABASE_URL=<Neon PostgreSQL URL>`
- [ ] `WEB_ORIGIN=<web app HTTPS origin>`

Notes:

- [ ] Do not bake `DATABASE_URL` or `AUTH_SECRET` into the Docker image.
- [ ] Keep `DATABASE_URL` unquoted when using Docker `--env-file`.
- [ ] Rotate Neon password if it was pasted into chats/logs.
- [ ] Use `WEB_ORIGIN=http://localhost:3000` only for temporary local testing. Replace it with deployed web URL later.

## Before Deploying API

- [ ] Install and initialize Yandex CLI.

```bash
yc init
yc config list
```

- [ ] Ensure Docker can authenticate with Yandex Container Registry.

```bash
yc container registry configure-docker
```

- [ ] Apply Prisma migrations to the configured database.

```bash
pnpm db:migrate:deploy
```

- [ ] Confirm API builds locally.

```bash
pnpm --filter api build
```

- [ ] Optional local Docker check.

```bash
docker build -f apps/api/Dockerfile -t fullstack-api .
docker run --env-file apps/api/.env -p 8080:8080 fullstack-api
curl http://localhost:8080/api/healthz
```

Expected:

```json
{"status":"ok"}
```

## Build And Push API Image

Registry ID currently used:

```text
crp5emfit56tmpg5qp5l
```

- [ ] Build image with the Yandex registry tag.

```bash
docker build -f apps/api/Dockerfile -t cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest .
```

- [ ] Confirm local tag exists.

```bash
docker images | grep fullstack-api
```

PowerShell:

```powershell
docker images | Select-String fullstack-api
```

- [ ] Push image.

```bash
docker push cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest
```

If push says the image does not exist locally, tag the existing image:

```bash
docker tag fullstack-api:latest cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest
docker push cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest
```

If push authentication fails:

```bash
yc container registry configure-docker
```

## Create Yandex Serverless Container

- [ ] Create container once.

```bash
yc serverless container create --name fullstack-api
```

- [ ] Create service account if needed.

```bash
yc iam service-account create --name fullstack-api-sa
```

- [ ] Get folder id and service account id.

```bash
yc config get folder-id
yc iam service-account list
```

- [ ] Grant registry image pull permission.

```bash
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.puller \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>
```

## Deploy API Revision

- [ ] Deploy revision from the pushed image.

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

- [ ] Allow public HTTPS invocation.

```bash
yc serverless container allow-unauthenticated-invoke fullstack-api
```

- [ ] Get container details and HTTPS URL.

```bash
yc serverless container get fullstack-api
```

- [ ] Test deployed API.

```bash
curl https://<container-url>/api/healthz
```

Expected:

```json
{"status":"ok"}
```

## Deploy Web To Vercel

- [ ] Commit `packages/api-client/openapi.json` and `packages/api-client/src/generated` so Vercel can build from a clean checkout.
- [ ] Import the GitHub repository in Vercel.
- [ ] Set the Vercel project root directory to `apps/web`.
- [ ] Keep the framework preset as Next.js.
- [ ] Set `LOCAL_API_URL` to the Yandex API HTTPS URL.
- [ ] Deploy the web app.
- [ ] Copy the Vercel app origin, for example `https://your-app.vercel.app`.
- [ ] Update the Yandex API `WEB_ORIGIN` environment variable to the Vercel origin.
- [ ] Deploy a new Yandex API revision.
- [ ] Test auth and API calls from the Vercel domain.

## Updating API Later

- [ ] Apply migrations if Prisma schema changed.

```bash
pnpm db:migrate:deploy
```

- [ ] Build and push a new image.

```bash
docker build -f apps/api/Dockerfile -t cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest .
docker push cr.yandex/crp5emfit56tmpg5qp5l/fullstack-api:latest
```

- [ ] Deploy a new revision with the same command from the deploy section.

## GitHub Actions CI/CD

Workflow file:

```text
.github/workflows/deploy-api-yc.yml
```

It runs on:

- [ ] Push to `main` when API/deployment-related files change.
- [ ] Manual `workflow_dispatch`.

What it does:

- [ ] Checks out the repo.
- [ ] Installs Yandex Cloud CLI.
- [ ] Authenticates with a Yandex service account key.
- [ ] Runs Prisma migrations against `DATABASE_URL`.
- [ ] Builds `apps/api/Dockerfile`.
- [ ] Pushes image to Yandex Container Registry using `github.sha` as the image tag.
- [ ] Deploys a new Serverless Container revision with the new image.

### GitHub Repository Variables

Add these in GitHub:

```text
Settings -> Secrets and variables -> Actions -> Variables
```

- [ ] `YC_REGISTRY_ID=crp5emfit56tmpg5qp5l`
- [ ] `YC_CONTAINER_NAME=fullstack-api`

### GitHub Repository Secrets

Add these in GitHub:

```text
Settings -> Secrets and variables -> Actions -> Secrets
```

- [ ] `YC_SERVICE_ACCOUNT_KEY_JSON`
- [ ] `YC_CLOUD_ID`
- [ ] `YC_FOLDER_ID`
- [ ] `YC_SERVICE_ACCOUNT_ID`
- [ ] `AUTH_SECRET`
- [ ] `DATABASE_URL`
- [ ] `WEB_ORIGIN`

`YC_SERVICE_ACCOUNT_KEY_JSON` is the full JSON created by:

```bash
yc iam key create \
  --service-account-name github-action \
  --output key.json
```

Copy the whole `key.json` content into the GitHub secret.

### Required Yandex Service Account Roles

The GitHub Actions service account needs these folder-level roles:

- [ ] `container-registry.images.pusher`
- [ ] `container-registry.images.puller`
- [ ] `serverless-containers.editor`
- [ ] `iam.serviceAccounts.user`

Grant roles:

```bash
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.pusher \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>

yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.puller \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>

yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role serverless-containers.editor \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>

yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role iam.serviceAccounts.user \
  --subject serviceAccount:<SERVICE_ACCOUNT_ID>
```

### CI/CD Redeploy Flow

- [ ] Commit changes to `main`.
- [ ] GitHub Actions builds image tag `${{ github.sha }}`.
- [ ] GitHub Actions pushes:

```text
cr.yandex/<registry-id>/fullstack-api:<commit-sha>
```

- [ ] GitHub Actions deploys a new Yandex Serverless Container revision.
- [ ] Test:

```bash
curl https://<container-url>/api/healthz
```

## Troubleshooting

- [ ] `An image does not exist locally with the tag`
  - Build with the full Yandex tag or run `docker tag`.

- [ ] Push auth fails.
  - Run `yc container registry configure-docker`.

- [ ] API starts locally but fails in Docker.
  - Check that `DATABASE_URL` is unquoted in env files used by Docker.
  - Check `AUTH_SECRET` length is at least 32 characters.

- [ ] API returns DB connection error.
  - Check Neon password/host.
  - Check that the Yandex container revision has `DATABASE_URL`.
  - Run `pnpm --filter api exec prisma migrate status` locally against the same URL.

- [ ] API returns CORS/cookie errors after web deploy.
  - Update `WEB_ORIGIN` to the deployed web HTTPS origin.
  - Deploy a new API revision.

- [ ] `/healthz` returns 404.
  - Correct path is `/api/healthz`.

- [ ] GitHub Actions cannot authenticate with Yandex Cloud.
  - Check that `YC_SERVICE_ACCOUNT_KEY_JSON` contains the full authorized key JSON.
  - Check `YC_CLOUD_ID` and `YC_FOLDER_ID`.

- [ ] GitHub Actions can push image but cannot deploy revision.
  - Check `serverless-containers.editor`.
  - Check `iam.serviceAccounts.user`.
  - Check `YC_SERVICE_ACCOUNT_ID`.

- [ ] GitHub Actions migration step fails.
  - Check `DATABASE_URL`.
  - Rotate/update Neon password if needed.
  - Run `pnpm db:migrate:deploy` locally with the same URL.
