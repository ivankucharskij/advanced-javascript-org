import { createRoute } from "@hono/zod-openapi";
import { healthCheckResponseSchema } from "@repo/shared-types/features/health/health.schemas";

const appTag = ["App"];

export const healthOpenApi = {
  getHealth: createRoute({
    method: "get",
    path: "/healthz",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: healthCheckResponseSchema,
          },
        },
        description: "Health check",
      },
    },
    tags: appTag,
  }),
};
