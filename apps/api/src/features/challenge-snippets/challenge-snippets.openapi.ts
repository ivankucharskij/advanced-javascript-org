import { createRoute } from "@hono/zod-openapi";
import {
  challengeSnippetIdParamsSchema,
  challengeSnippetListQuerySchema,
  challengeSnippetListResponseSchema,
  createChallengeSnippetSchema,
  deleteChallengeSnippetResponseSchema,
  errorResponseSchema,
  singleChallengeSnippetResponseSchema,
  updateChallengeSnippetSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const challengeSnippetsTag = ["Challenge Snippets"];
const adminBearerSecurity = [{ adminBearerAuth: [] }];

export const challengeSnippetsOpenApi = {
  create: createRoute({
    method: "post",
    path: "/challenge-snippets",
    request: {
      body: {
        content: jsonContent(createChallengeSnippetSchema),
        required: true,
      },
    },
    security: adminBearerSecurity,
    responses: {
      201: {
        content: jsonContent(singleChallengeSnippetResponseSchema),
        description: "Create a challenge snippet",
      },
      409: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet slug already exists",
      },
    },
    tags: challengeSnippetsTag,
  }),
  delete: createRoute({
    method: "delete",
    path: "/challenge-snippets/{id}",
    request: {
      params: challengeSnippetIdParamsSchema,
    },
    security: adminBearerSecurity,
    responses: {
      200: {
        content: jsonContent(deleteChallengeSnippetResponseSchema),
        description: "Delete a challenge snippet",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet was not found",
      },
      409: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet is used by challenges",
      },
    },
    tags: challengeSnippetsTag,
  }),
  list: createRoute({
    method: "get",
    path: "/challenge-snippets",
    request: {
      query: challengeSnippetListQuerySchema,
    },
    security: adminBearerSecurity,
    responses: {
      200: {
        content: jsonContent(challengeSnippetListResponseSchema),
        description: "List challenge snippets",
      },
    },
    tags: challengeSnippetsTag,
  }),
  update: createRoute({
    method: "patch",
    path: "/challenge-snippets/{id}",
    request: {
      body: {
        content: jsonContent(updateChallengeSnippetSchema),
        required: true,
      },
      params: challengeSnippetIdParamsSchema,
    },
    security: adminBearerSecurity,
    responses: {
      200: {
        content: jsonContent(singleChallengeSnippetResponseSchema),
        description: "Update a challenge snippet",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet was not found",
      },
      409: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge snippet slug already exists",
      },
    },
    tags: challengeSnippetsTag,
  }),
};
