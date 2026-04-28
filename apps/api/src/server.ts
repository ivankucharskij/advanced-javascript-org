import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@repo/database/client";
import { logger } from "hono/logger";

import { openApiDocumentConfig } from "./openapi.js";
import { createRouter } from "./router.js";

export const createServer = () => {
  const app = new OpenAPIHono();

  app.use("*", logger());
  app.route("/", createRouter());
  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "Bearer",
  });

  app.doc("/doc", openApiDocumentConfig);
  app.get("/swagger", swaggerUI({ url: "/doc" }));

  return app;
};

const logDatabaseAvailabilityAtStartup = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.info("Database running");
  } catch {
    console.warn("Database is not available");
  }
};

export const startServer = () => {
  const port = Number(process.env.PORT ?? 8080);
  const app = createServer();

  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`API listening on http://localhost:${port}`);
  void logDatabaseAvailabilityAtStartup();
};

startServer();
