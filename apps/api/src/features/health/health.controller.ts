import { OpenAPIHono } from "@hono/zod-openapi";

import { checkDbHealth } from "../../lib/db.js";
import { HttpStatus } from "../../shared/http.js";
import { healthOpenApi } from "./health.openapi.js";

export const healthRouter = new OpenAPIHono();

healthRouter.openapi(healthOpenApi.getHealth, async (c) => {
  try {
    await checkDbHealth();

    return c.json(
      {
        db: "ok" as const,
        status: "healthy" as const,
      },
      HttpStatus.OK,
    );
  } catch {
    return c.json(
      {
        db: "fail" as const,
        status: "unhealthy" as const,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
});
