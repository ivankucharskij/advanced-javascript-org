import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { type Env, getEnv } from "./config/env.js";
import { openApiDocumentConfig } from "./config/openapi.js";
import { createRouter } from "./router.js";

export const createApp = (runtimeEnv: Env = getEnv()) => {
  const app = new OpenAPIHono();
  app.use("*", logger());

  // cors
  const webOrigins = [
    runtimeEnv.WEB_ORIGIN,
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter((origin): origin is string => Boolean(origin));
  app.use(
    "/api/*",
    cors({
      origin: webOrigins,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );
  // cors

  app.route("/api", createRouter());

  // docs
  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "Bearer",
  });
  app.openAPIRegistry.registerComponent("securitySchemes", "adminBearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "Bearer",
  });

  app.doc("/api/openapi.json", openApiDocumentConfig);
  app.doc("/api/doc", openApiDocumentConfig);
  app.get("/api/swagger", swaggerUI({ url: "/api/openapi.json" }));
  // docs

  return app;
};
