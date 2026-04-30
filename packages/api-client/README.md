# API Client

Generated multi-file Orval client for the local API.

## Generate

Run the generator from the repo root while `apps/api` is running:

```bash
pnpm generate:api-client
```

By default it reads `http://127.0.0.1:8080/doc`, stores a snapshot in `packages/api-client/openapi.json`, and writes generated files into `packages/api-client/src/generated`.
The generated output is types-only: model types in `src/generated/models` and operation-derived types in `src/generated/operations`.

`src/generated` is ignored by Git, so regenerate it after cloning before building packages that import `@repo/api-client`.
