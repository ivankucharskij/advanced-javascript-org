# Two-Week App Plan: Tender Intelligence Workspace

## Goal

Build one coherent portfolio app that can be referenced in cover letters for Python,
Vue, and Node.js roles:

- Python example: FastAPI backend with PostgreSQL, migrations, search, RAG-style
  retrieval, structured LLM integration, tests, and OpenAPI.
- Vue example: Vue 3 + Vite + TypeScript product UI for upload, search, tender
  details, and fit analysis.
- Node.js example: TypeScript worker that handles document extraction and queue
  processing with retries and observable job states.

The app must start locally with:

```bash
docker compose up
```

This should be a readable, realistic engineering project, not a stack demo with
duplicated functionality.

## Product

Tender Intelligence Workspace

Users can upload tender documents, extract/index their contents, search across
tenders, and run an AI-assisted fit analysis against a company profile.

Core workflow:

1. Upload PDF/DOCX or seed sample tenders.
2. Store tender metadata in PostgreSQL.
3. Queue document processing through Redis.
4. Node worker extracts text and reports progress.
5. Python API chunks text, stores searchable records, and creates embeddings.
6. Vue UI searches, filters, opens tender details, and runs fit analysis.
7. API returns structured analysis with score, reasons, risks, and citations.

## Architecture Decision

Use a small polyglot monorepo.

Reason:

- The existing repository is already a Turborepo-style workspace.
- One repo is easier to review from a job application link.
- Docker Compose can make the polyglot setup simple for reviewers.
- Building two full apps with the same functionality is too much for two weeks
  and would look artificial.

Target structure:

```text
apps/
  api/             # FastAPI service, owns REST API and database writes
  worker/          # Node.js TypeScript Redis worker for document extraction
  web/             # Vue 3 + Vite + TypeScript UI
packages/
  api-client/      # generated TypeScript client from OpenAPI
  eslint-config/   # keep if useful for Node/Vue
  typescript-config/
infra/
  postgres/
    init.sql       # pgvector and full-text helper setup if needed
docker-compose.yml
README.md
```

Keep from current repo:

- Root package manager/workspace setup if it stays lightweight.
- `packages/api-client` idea, but regenerate it from the new FastAPI OpenAPI
  spec.
- Shared TypeScript/ESLint config if it saves work.

Remove or replace:

- Existing task-management domain.
- Existing Next.js UI, unless a small utility is worth copying.
- Existing Hono/Prisma API, because the primary backend needs to demonstrate
  Python/FastAPI.
- Generated API client files for the old task API.
- Deployment notes that only describe the old app.

## Services

### `apps/api` - Python/FastAPI

Responsibilities:

- REST API and OpenAPI documentation.
- PostgreSQL access with SQLAlchemy 2.x async or SQLModel.
- Alembic migrations.
- Tender metadata CRUD where needed.
- Upload endpoint.
- Search endpoint with filters and cursor pagination.
- Chunk storage and retrieval.
- pgvector semantic search.
- Hybrid ranking: full-text score + vector similarity + metadata boosts.
- Fit-analysis endpoint returning structured JSON.
- Integration boundary for OpenAI-compatible providers, with deterministic local
  fallback for reviewers without API keys.

Important endpoints:

```text
GET  /healthz
POST /tenders
POST /tenders/{id}/documents
GET  /tenders
GET  /tenders/{id}
GET  /tenders/search
POST /tenders/{id}/analyze-fit
GET  /jobs/{id}
GET  /openapi.json
```

### `apps/worker` - Node.js/TypeScript

Responsibilities:

- Consume Redis jobs.
- Extract text from PDF/DOCX.
- Normalize document text.
- Split large files into processing batches if needed.
- Call internal API endpoints to persist extracted text/chunks.
- Update job status: `UPLOADED`, `EXTRACTING`, `INDEXING`, `READY`, `FAILED`.
- Use retries with backoff and structured logs.

This gives a real Node.js example without duplicating the backend.

### `apps/web` - Vue 3/Vite/TypeScript

Responsibilities:

- Dashboard with processing status and recent tenders.
- Upload flow.
- Search page with filters:
  - country
  - deadline
  - budget
  - CPV/category
  - language
  - buyer/authority
- Tender detail page with extracted chunks/citations.
- Fit-analysis panel with score, reasons, risks, and cited evidence.
- Typed API client generated from OpenAPI.

Use a restrained operational UI: dense, readable, and professional. Avoid a
marketing landing page.

## Data Model

Minimum tables:

```text
tenders
  id
  title
  buyer_name
  country
  language
  cpv_code
  category
  budget_amount
  budget_currency
  deadline_at
  source_url
  status
  created_at
  updated_at

documents
  id
  tender_id
  filename
  content_type
  storage_path
  status
  error_message
  created_at
  updated_at

document_chunks
  id
  tender_id
  document_id
  chunk_index
  text
  text_tsvector
  embedding vector
  created_at

analysis_runs
  id
  tender_id
  company_profile
  fit_score
  reasons jsonb
  risks jsonb
  citations jsonb
  provider
  created_at

jobs
  id
  tender_id
  document_id
  type
  status
  attempts
  error_message
  created_at
  updated_at
```

## AI/RAG Scope

Do:

- Chunk extracted tender text.
- Generate embeddings through an OpenAI-compatible interface.
- Support local deterministic fake embeddings for no-key demo runs.
- Retrieve relevant chunks before analysis.
- Return structured output validated by Pydantic.
- Include citations to retrieved chunks.
- Add timeouts, retries, and clear error handling around external API calls.

Do not:

- Build a full LangChain/LlamaIndex abstraction.
- Add agent frameworks.
- Build chat.
- Add auth/RBAC unless all core features are already done.

Reliability answer for interviews:

> I wrap external API calls with explicit timeouts, bounded retries with jitter,
> structured response validation, provider-specific error mapping, idempotent
> job handling, and logs/traces that make failures visible without corrupting
> user-facing state.

## Search Scope

Minimum impressive version:

- PostgreSQL full-text search over chunks.
- Metadata filters.
- Cursor pagination.
- pgvector semantic search.
- Hybrid score combining keyword rank and vector similarity.

Nice-to-have only after MVP:

- BM25-like ranking notes or approximation.
- Search result highlighting.
- Saved searches.

## Docker Compose

Compose services:

```text
postgres   # pgvector-enabled PostgreSQL
redis      # queue/job coordination
api        # FastAPI
worker     # Node.js worker
web        # Vue app
```

Reviewer path:

```bash
docker compose up --build
```

Expected local URLs:

```text
Web:      http://localhost:5173
API:      http://localhost:8000
OpenAPI:  http://localhost:8000/docs
```

Seed data should work without external API keys.

## README Requirements

The README is part of the portfolio and must be clear.

Required sections:

- What the app does.
- Architecture diagram or concise service map.
- Why FastAPI + PostgreSQL full-text + pgvector.
- Queue/document-processing design.
- AI integration design and local fallback mode.
- How to run with Docker Compose.
- How to run tests.
- API examples with curl.
- Screenshots or short UI walkthrough.
- Production tradeoffs and what would improve next.
- Cover-letter snippets:
  - Python/FastAPI role.
  - Vue frontend role.
  - Node.js backend/worker role.

## Two-Week Delivery Plan

### Day 1 - Repo cleanup and skeleton

- Decide final folder structure.
- Add root `docker-compose.yml`.
- Create FastAPI, Vue, and Node worker app skeletons.
- Remove old task-domain code after confirming nothing useful is needed.
- Update root README with the new project direction.

Acceptance:

- `docker compose up --build` starts empty API, worker, web, Postgres, and Redis.
- `/healthz` works.

### Day 2 - Database and migrations

- Add SQLAlchemy/SQLModel models.
- Add Alembic migrations.
- Enable pgvector.
- Create tender/document/chunk/job/analysis tables.
- Add seed script with realistic sample tenders.

Acceptance:

- Fresh compose database migrates and seeds.
- API can list seeded tenders.

### Day 3 - Upload and job lifecycle

- Add document upload endpoint.
- Store files in a local mounted volume.
- Create processing jobs.
- Add job status endpoint.
- Add basic job status UI.

Acceptance:

- Upload creates document and job records.
- UI shows status from API.

### Day 4 - Node worker extraction

- Implement Redis worker.
- Extract text from PDF/DOCX.
- Handle failures and retries.
- Send extracted text back to API.

Acceptance:

- Uploaded sample document reaches `READY` or `FAILED` with useful error output.
- Worker logs are structured enough to debug.

### Day 5 - Chunking and full-text search

- Chunk extracted text.
- Store chunks.
- Add PostgreSQL full-text index.
- Add search endpoint with metadata filters.

Acceptance:

- Search returns relevant seeded and uploaded tenders.
- Filters work.

### Day 6 - Vue search UI

- Build search/filter page.
- Add tender result list.
- Add tender detail page.
- Use typed API client or typed axios wrapper.

Acceptance:

- Reviewer can search and inspect tender details from the UI.

### Day 7 - Semantic search foundation

- Add embedding provider interface.
- Add deterministic local embedding fallback.
- Store vectors in pgvector.
- Add semantic search path.

Acceptance:

- Search works without API keys.
- With API key, real embeddings can be enabled by env var.

### Day 8 - Hybrid ranking

- Combine full-text rank, vector similarity, and metadata boosts.
- Add pagination.
- Add tests around ranking behavior.

Acceptance:

- Search response includes score parts or explainable ranking fields.

### Day 9 - Fit analysis

- Add `POST /tenders/{id}/analyze-fit`.
- Retrieve relevant chunks.
- Call LLM provider or deterministic fallback.
- Validate structured output with Pydantic.
- Persist analysis runs.

Acceptance:

- API returns `fitScore`, `reasons`, `risks`, and `citations`.
- UI renders the result cleanly.

### Day 10 - Tests and API client

- Add focused pytest coverage for API services.
- Add Node worker unit tests for extraction/status behavior.
- Add Vue component or integration smoke tests if time allows.
- Generate TypeScript API client from OpenAPI.

Acceptance:

- One command runs useful tests.
- Generated client matches current API.

### Day 11 - Polish UX and error states

- Improve upload/search/detail UI.
- Add loading, empty, failed, and retry states.
- Make layout responsive.
- Verify text does not overflow buttons/cards/tables.

Acceptance:

- UI looks like a real internal tool, not a template.

### Day 12 - Observability and load script

- Add structured logs.
- Add request IDs where practical.
- Add simple load/search script.
- Add API error response consistency.

Acceptance:

- Failures are understandable from logs and API responses.

### Day 13 - Documentation and screenshots

- Rewrite README.
- Add architecture notes.
- Add screenshots.
- Add cover-letter snippets.
- Document env vars and no-key fallback behavior.

Acceptance:

- A reviewer can understand and run the project from README alone.

### Day 14 - Final hardening

- Fresh clone simulation.
- Run `docker compose up --build`.
- Run migrations, seed, tests, and core UI workflow.
- Fix only blocking bugs.
- Remove stale files and old generated artifacts.

Acceptance:

- Project is ready to link in job applications.

## MVP Cut Line

Must finish:

- Docker Compose startup.
- FastAPI backend.
- Vue UI.
- Node worker.
- PostgreSQL schema and migrations.
- Redis-backed document processing.
- Upload, status, search, detail, and fit analysis.
- README with architecture notes and cover-letter snippets.

Can cut:

- Auth/RBAC.
- Complex deployment setup.
- Full LangChain/LlamaIndex integration.
- Advanced admin screens.
- Multiple backend implementations.
- Perfect BM25.
- Extensive E2E tests.

## Cover-Letter Positioning

Python:

> I built a FastAPI tender-intelligence API with async PostgreSQL access,
> Alembic migrations, pgvector semantic search, structured LLM responses,
> OpenAPI docs, pytest coverage, and Docker Compose local infrastructure.

Vue:

> I built the Vue 3/Vite/TypeScript interface for the same system: upload flow,
> searchable tender list, filters, detail pages, analysis results, API error
> states, and a typed client generated from OpenAPI.

Node.js:

> I built a Node.js/TypeScript worker that consumes Redis jobs, extracts text
> from tender documents, handles retries/failures, and coordinates processing
> state with the FastAPI service.

## Final Quality Bar

- One command starts the app.
- No dead old task-app routes or generated types remain.
- README explains the project faster than the code does.
- The UI is clean, dense, and usable.
- The backend shows real data modeling and integration judgment.
- The worker is small but production-shaped.
- The project is believable as two weeks of focused work.
