# Fullstack App Container

This image runs the Next.js web app and the Hono API in one container. PostgreSQL stays external.
The public HTTP server is Next.js. The API listens on an internal port, and Next.js proxies `/api/*` to it.

Build from the repository root:

```bash
docker build -f infra/Dockerfile -t fullstack-app .
```

Run with an external database:

```bash
docker run --rm \
  -p 3000:3000 \
  -p 8080:8080 \
  -e DATABASE_URL='postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public' \
  -e AUTH_SECRET='local-dev-auth-secret-change-me-32-characters' \
  -e WEB_ORIGIN='http://localhost:3000' \
  fullstack-app
```

Required runtime environment:

- `DATABASE_URL`: external PostgreSQL connection string.
- `AUTH_SECRET`: at least 32 characters.
- `WEB_ORIGIN`: deployed web origin for API CORS.

Optional runtime environment:

- `PORT`: public Next.js port. Yandex Serverless Containers sets this automatically. Local default is `3000`.
- `API_PORT`: internal API port, default `8080`.
- `LOCAL_API_URL`: URL used by Next.js rewrites for `/api/*`, default `http://127.0.0.1:8080`.

Apply migrations against the same external database before starting or deploying:

```bash
pnpm db:migrate:deploy
```

Health checks:

```bash
curl http://localhost:3000/api/healthz
curl http://localhost:3000
```

When using the combined image in Yandex Serverless Containers, invoke the web URL and health check through the public port:

```bash
curl https://<container-url>/api/healthz
```

For a local PostgreSQL container only:

```bash
docker compose -f infra/postgres.compose.yaml up -d
```

The older API-only image is still available for API-specific deployments:

```bash
docker build -f infra/api.Dockerfile -t fullstack-api .
```
