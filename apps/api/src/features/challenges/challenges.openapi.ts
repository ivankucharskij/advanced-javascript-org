import { createRoute } from "@hono/zod-openapi";
import {
  challengeIdParamsSchema,
  challengeListQuerySchema,
  challengeListResponseSchema,
  createChallengeSchema,
  deleteChallengeResponseSchema,
  errorResponseSchema,
  singleChallengeResponseSchema,
  updateChallengeSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const challengesTag = ["Challenges"];
const bearerSecurity = [{ bearerAuth: [] }];

export const challengesOpenApi = {
  create: createRoute({
    method: "post",
    path: "/challenges",
    request: {
      body: {
        content: jsonContent(createChallengeSchema),
        required: true,
      },
    },
    security: bearerSecurity,
    responses: {
      201: {
        content: jsonContent(singleChallengeResponseSchema),
        description: "Create a flashcard challenge",
      },
      409: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge slug already exists",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet was not found",
      },
    },
    tags: challengesTag,
  }),
  delete: createRoute({
    method: "delete",
    path: "/challenges/{id}",
    request: {
      params: challengeIdParamsSchema,
    },
    security: bearerSecurity,
    responses: {
      200: {
        content: jsonContent(deleteChallengeResponseSchema),
        description: "Delete a flashcard challenge",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge or challenge snippet was not found",
      },
    },
    tags: challengesTag,
  }),
  list: createRoute({
    method: "get",
    path: "/challenges",
    request: {
      query: challengeListQuerySchema,
    },
    security: bearerSecurity,
    responses: {
      200: {
        content: jsonContent(challengeListResponseSchema),
        description: "List flashcard challenges",
      },
    },
    tags: challengesTag,
  }),
  update: createRoute({
    method: "patch",
    path: "/challenges/{id}",
    request: {
      body: {
        content: jsonContent(updateChallengeSchema),
        required: true,
      },
      params: challengeIdParamsSchema,
    },
    security: bearerSecurity,
    responses: {
      200: {
        content: jsonContent(singleChallengeResponseSchema),
        description: "Update a flashcard challenge",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge was not found",
      },
      409: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge slug already exists",
      },
    },
    tags: challengesTag,
  }),
};
