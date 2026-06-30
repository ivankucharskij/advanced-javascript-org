import { createRoute } from "@hono/zod-openapi";
import { errorResponseSchema, meResponseSchema } from "@repo/shared-types";

const authTag = ["Auth"];
const bearerSecurity = [{ bearerAuth: [] }];

export const authOpenApi = {
  me: createRoute({
    method: "get",
    path: "/me",
    security: bearerSecurity,
    responses: {
      200: {
        content: {
          "application/json": {
            schema: meResponseSchema,
          },
        },
        description: "Get the current authenticated user",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
    },
    tags: authTag,
  }),
};
