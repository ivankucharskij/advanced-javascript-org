APP_IMAGE ?= fullstack-app
API_IMAGE ?= fullstack-api
REGISTRY_ID ?= crp5emfit56tmpg5qp5l
API_REGISTRY_IMAGE ?= cr.yandex/$(REGISTRY_ID)/$(API_IMAGE):latest
ENV_FILE ?= apps/api/.env
DOCKER_DATABASE_URL ?= postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public

.PHONY: help build run build-api run-api push-api db-up db-down db-logs migrate check clean

help:
	@echo "Available targets:"
	@echo "  make build       Build combined web + API image"
	@echo "  make run         Run combined image with ENV_FILE"
	@echo "  make build-api   Build API-only image"
	@echo "  make run-api     Run API-only image with ENV_FILE"
	@echo "  make push-api    Build and push API image to Yandex registry"
	@echo "  make db-up       Start local Postgres"
	@echo "  make db-down     Stop local Postgres"
	@echo "  make migrate     Apply Prisma migrations"
	@echo "  make check       Build API and web locally"

build:
	docker build -f infra/Dockerfile -t $(APP_IMAGE) .

run:
	docker run --rm \
		--env-file $(ENV_FILE) \
		-e PORT=3000 \
		-e API_PORT=8080 \
		-e LOCAL_API_URL=http://127.0.0.1:8080 \
		-e DATABASE_URL=$(DOCKER_DATABASE_URL) \
		-e WEB_ORIGIN=http://localhost:3000 \
		-p 3000:3000 \
		$(APP_IMAGE)

build-api:
	docker build -f infra/api.Dockerfile -t $(API_IMAGE) .

run-api:
	docker run --rm \
		--env-file $(ENV_FILE) \
		-p 8080:8080 \
		$(API_IMAGE)

push-api:
	docker build -f infra/api.Dockerfile -t $(API_REGISTRY_IMAGE) .
	docker push $(API_REGISTRY_IMAGE)

db-up:
	docker compose -f infra/postgres.compose.yaml up -d

db-down:
	docker compose -f infra/postgres.compose.yaml down

db-logs:
	docker compose -f infra/postgres.compose.yaml logs -f postgres

migrate:
	pnpm db:migrate:deploy

check:
	pnpm --filter api build
	pnpm --filter web build

clean:
	docker image rm $(APP_IMAGE) $(API_IMAGE) $(API_REGISTRY_IMAGE)
