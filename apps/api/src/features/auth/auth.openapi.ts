import { createRoute } from "@hono/zod-openapi";
import {
  errorResponseSchema,
  googleCallbackResponseSchema,
  meResponseSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const authTag = ["Auth"];
const bearerSecurity = [{ bearerAuth: [] }];

export const authOpenApi = {
  google: createRoute({
    description:
      "Starts Google OAuth. Open this URL directly in the browser; Swagger Execute uses fetch and cannot follow the cross-origin Google redirect.",
    method: "get",
    path: "/auth/google",
    responses: {
      302: {
        description: "Redirect to Google OAuth",
      },
    },
    tags: authTag,
  }),
  googleCallback: createRoute({
    method: "get",
    path: "/auth/google/callback",
    responses: {
      200: {
        content: jsonContent(googleCallbackResponseSchema),
        description: "Complete Google OAuth and return authenticated session",
      },
      401: {
        content: jsonContent(errorResponseSchema),
        description: "Unauthorized",
      },
    },
    tags: authTag,
  }),
  me: createRoute({
    method: "get",
    path: "/me",
    security: bearerSecurity,
    responses: {
      200: {
        content: jsonContent(meResponseSchema),
        description: "Get the current authenticated user",
      },
      401: {
        content: jsonContent(errorResponseSchema),
        description: "Unauthorized",
      },
    },
    tags: authTag,
  }),
};
