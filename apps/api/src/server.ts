import "dotenv/config";

import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { getEnv } from "./config/env.js";
import { openApiDocumentConfig } from "./config/openapi.js";
import { prisma } from "./lib/prisma.js";
import { createRouter } from "./router.js";

export const createServer = (runtimeEnv = getEnv()) => {
  const app = new OpenAPIHono();
  const webOrigins = [
    runtimeEnv.WEB_ORIGIN,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter((origin): origin is string => Boolean(origin));

  app.use("*", logger());
  app.use(
    "/api/*",
    cors({
      origin: webOrigins,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );
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

const assertDatabaseAvailable = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

export const startServer = async () => {
  const runtimeEnv = getEnv();

  await assertDatabaseAvailable();

  const app = createServer(runtimeEnv);

  serve({
    fetch: app.fetch,
    port: runtimeEnv.PORT,
  });

  console.log(`API listening on http://localhost:${runtimeEnv.PORT}`);
};

startServer().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";

  console.error(`API failed to start: ${message}`);
  process.exitCode = 1;
});
