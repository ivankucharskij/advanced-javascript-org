import { createRoute } from "@hono/zod-openapi";
import {
  adminSessionResponseSchema,
  adminSessionSchema,
  errorResponseSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const adminTag = ["Admin"];

export const adminOpenApi = {
  session: createRoute({
    method: "post",
    path: "/admin/session",
    request: {
      body: {
        content: jsonContent(adminSessionSchema),
        required: true,
      },
    },
    responses: {
      200: {
        content: jsonContent(adminSessionResponseSchema),
        description: "Create a short-lived admin access token",
      },
      401: {
        content: jsonContent(errorResponseSchema),
        description: "Invalid admin code",
      },
    },
    tags: adminTag,
  }),
};
