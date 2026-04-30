import { OpenAPIHono } from "@hono/zod-openapi";

import { healthOpenApi } from "./openapi.js";

export const healthRouter = new OpenAPIHono();

healthRouter.openapi(healthOpenApi.getHealth, (c) => {
  return c.json({
    status: "healthy",
  });
});
