# advanced-javascript-org Container

This image runs the Next.js web app and the Hono API in one container. PostgreSQL stays external.
The public HTTP server is Next.js. The API listens on an internal port, and Next.js proxies `/api/*` to it.

Build from the repository root:

```bash
docker build -f infra/Dockerfile -t advanced-javascript-org .
```

Run with an external database:

```bash
docker run --rm \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_URL='postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public' \
  -e ADMIN_CODE='<admin code for Swagger admin sessions>' \
  -e AUTH_SECRET='local-dev-auth-secret-change-me-32-characters' \
  -e WEB_ORIGIN='http://localhost:3000' \
  -e GOOGLE_CLIENT_ID='<google oauth client id>' \
  -e GOOGLE_CLIENT_SECRET='<google oauth client secret>' \
  -e GOOGLE_REDIRECT_URI='http://localhost:3000/api/auth/google/callback' \
  advanced-javascript-org
```

Required runtime environment:

- `DATABASE_URL`: external PostgreSQL connection string.
- `ADMIN_CODE`: admin code used to issue 12-hour Swagger admin bearer tokens.
- `AUTH_SECRET`: at least 32 characters.
- `WEB_ORIGIN`: public web origin for API CORS.
- `GOOGLE_CLIENT_ID`: Google OAuth client id.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.
- `GOOGLE_REDIRECT_URI`: public Google OAuth callback URL, ending in `/api/auth/google/callback`.

Product/runtime notes:

- The user-facing practice experience is flashcards.
- Backend/API/schema naming intentionally uses `Challenge*` and `/api/challenges/*`.
- Reusable code examples are stored as `ChallengeSnippet` rows, and challenge questions reference snippets by `snippetId`.
- Public practice endpoints are served under `/api/challenges/*`, including dashboard, next-card, answer, and restart.
- Swagger UI is served at `/api/swagger`; OpenAPI JSON is served at `/api/openapi.json`.
- Auth is Google OAuth only. Do not configure local email/password accounts.
- Guest sessions are temporary progress buffers and are discarded after Google login merge.

Optional runtime environment:

- `PORT`: public Next.js port. The combined Docker image defaults to `8080`; set `PORT=3000` for local host port mapping.
- `API_PORT`: internal API port, default `8081` for the combined image.
- `LOCAL_API_URL`: URL used by Next.js rewrites for `/api/*`, default `http://127.0.0.1:8081` for the combined image.

Apply migrations against the same external database before starting or deploying:

```bash
pnpm db:migrate:deploy
```

Health checks:

```bash
curl http://localhost:3000/api/healthz
curl http://localhost:3000
```

When using the combined image in Yandex Cloud Serverless Containers, invoke the web URL and health check through the public port:

```bash
curl https://<container-url>/api/healthz
```

For a local PostgreSQL container only:

```bash
docker compose -f infra/postgres.compose.yaml up -d
```

The API-only image is still available for local or debugging use:

```bash
docker build -f infra/api.Dockerfile -t advanced-javascript-org-api .
```
