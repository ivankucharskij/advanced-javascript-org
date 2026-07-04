import { createRoute } from "@hono/zod-openapi";
import {
  discardGuestSessionResponseSchema,
  errorResponseSchema,
  guestSessionResponseSchema,
  startGuestSessionResponseSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const guestSessionTag = ["Guest Sessions"];

export const guestSessionsOpenApi = {
  current: createRoute({
    method: "get",
    path: "/guest-session",
    responses: {
      200: {
        content: jsonContent(guestSessionResponseSchema),
        description: "Get the current guest session from the guest cookie",
      },
    },
    tags: guestSessionTag,
  }),
  discard: createRoute({
    method: "delete",
    path: "/guest-session",
    responses: {
      200: {
        content: jsonContent(discardGuestSessionResponseSchema),
        description: "Discard the current guest session and clear its cookie",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Guest session was not found",
      },
    },
    tags: guestSessionTag,
  }),
  start: createRoute({
    method: "post",
    path: "/guest-session",
    responses: {
      201: {
        content: jsonContent(startGuestSessionResponseSchema),
        description: "Create or reuse the current guest session",
      },
    },
    tags: guestSessionTag,
  }),
};
