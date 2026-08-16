# Infrastructure

`infra` contains the local YDB service and Docker runtimes for Advanced JavaScript.

## Topology

The production image runs two Node processes in one container through `infra/start.mjs`:

```text
browser -> Next.js on PORT -> /api/* rewrite -> Hono on API_PORT -> external YDB
```

- `Dockerfile`: combined Next.js + Hono production image.
- `api.Dockerfile`: API-only local/debug image.
- `db.compose.yml`: local YDB service.
- `start.mjs`: combined-process launcher and shutdown handling.
- `Dockerfile.dockerignore`: combined build context exclusions.

## Local YDB

Start and stop the database from the repository root:

```bash
pnpm db:up
pnpm db:down
```

Local endpoints:

- YDB gRPC: `localhost:2136`
- YDB TLS gRPC: `localhost:2135`
- YDB UI: `http://localhost:9876`
- Kafka proxy: `localhost:9092`

The UI maps host port `9876` to container port `8765` to avoid Windows reserved-port conflicts. Persistent data uses the `db-data` and `db-certs` Docker volumes. The container is named `repo-db-local`.

Apply migrations separately:

```bash
pnpm db:migrate
pnpm db:status
```

## Combined Image

Build and run with the root scripts:

```bash
pnpm docker:build
pnpm docker:run
```

The local run script:

- exposes Next.js at `http://localhost:3000`
- runs Hono internally on `8081`
- sets `LOCAL_API_URL=http://127.0.0.1:8081`
- connects to host-local YDB through `grpc://host.docker.internal:2136/local`
- loads the remaining runtime values from `apps/api/.env`

Smoke checks:

```bash
curl http://localhost:3000
curl http://localhost:3000/api/healthz
```

The multi-stage combined image builds `@repo/shared-types`, `api`, and `web`; copies the API output and standalone Next.js output; installs production API dependencies; and runs as a non-root user.

## Runtime Environment

Required application values:

- `DB_CONNECTION_STRING`
- `ADMIN_CODE`
- `AUTH_SECRET` (at least 32 characters)
- `WEB_ORIGIN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- YDB credential mode: `YDB_ANONYMOUS_CREDENTIALS=1` locally or `YDB_METADATA_CREDENTIALS=1` in Yandex Cloud

Container routing values:

- `PORT`: public Next.js port; image default `8080`, local root script override `3000`.
- `API_PORT`: internal Hono port; default `8081`.
- `LOCAL_API_URL`: internal API target; default `http://127.0.0.1:8081`.

YDB is external to the application image. Do not bake secrets or database connection strings into the image.

## API-Only Image

The API-only image is retained for local/debug use:

```bash
pnpm docker:build-api
pnpm docker:run-api
```

It exposes Hono on `http://localhost:8080`. For host-local YDB, set `DB_CONNECTION_STRING=grpc://host.docker.internal:2136/local`.

## Yandex Cloud Deployment

`.github/workflows/deploy-yc.yml` builds and pushes the combined image and deploys a Yandex Cloud Serverless Container revision when relevant files change on `main`, or when manually dispatched.

Production topology:

- Next.js public port: `8080`
- Hono internal port: `8081`
- API rewrite target: `http://127.0.0.1:8081`
- YDB authentication: revision service account through metadata credentials

The workflow supplies application secrets as revision environment variables. Production Goose migrations are a separate operation and must run before deploying code that requires a new schema. See `docs/RUNBOOK.md` for provisioning and migration commands.
