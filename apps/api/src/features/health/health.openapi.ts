import { createRoute } from "@hono/zod-openapi";
import { healthCheckResponseSchema } from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const appTag = ["App"];
export const healthOpenApi = {
  getHealth: createRoute({
    method: "get",
    path: "/healthz",
    responses: {
      200: {
        content: jsonContent(healthCheckResponseSchema),
        description: "Health check",
      },
      503: {
        content: jsonContent(healthCheckResponseSchema),
        description: "Health check failed",
      },
    },
    tags: appTag,
  }),
};
