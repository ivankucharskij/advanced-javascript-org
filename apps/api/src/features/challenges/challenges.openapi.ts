import { createRoute } from "@hono/zod-openapi";
import {
  challengeAnswerResponseSchema,
  challengeAnswerSchema,
  challengeDashboardResponseSchema,
  challengeIdParamsSchema,
  challengeListQuerySchema,
  challengeListResponseSchema,
  challengeRestartResponseSchema,
  challengeSessionQuerySchema,
  challengeSessionResponseSchema,
  createChallengeSchema,
  deleteChallengeResponseSchema,
  errorResponseSchema,
  singleChallengeResponseSchema,
  updateChallengeSchema,
} from "@repo/shared-types";

import { jsonContent } from "../../shared/http.js";

const challengesTag = ["Challenges"];
const adminBearerSecurity = [{ adminBearerAuth: [] }];

export const challengesOpenApi = {
  answer: createRoute({
    method: "post",
    path: "/challenges/{id}/answer",
    request: {
      body: {
        content: jsonContent(challengeAnswerSchema),
        required: true,
      },
      params: challengeIdParamsSchema,
    },
    responses: {
      200: {
        content: jsonContent(challengeAnswerResponseSchema),
        description: "Answer a flashcard challenge",
      },
      404: {
        content: jsonContent(errorResponseSchema),
        description: "Challenge or answer option was not found",
      },
    },
    tags: challengesTag,
  }),
  create: createRoute({
    method: "post",
    path: "/challenges",
    request: {
      body: {
        content: jsonContent(createChallengeSchema),
        required: true,
      },
    },
    security: adminBearerSecurity,
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
  dashboard: createRoute({
    method: "get",
    path: "/challenges/dashboard",
    responses: {
      200: {
        content: jsonContent(challengeDashboardResponseSchema),
        description:
          "Get the flashcard dashboard for the current user or guest",
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
    security: adminBearerSecurity,
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
    security: adminBearerSecurity,
    responses: {
      200: {
        content: jsonContent(challengeListResponseSchema),
        description: "List flashcard challenges",
      },
    },
    tags: challengesTag,
  }),
  next: createRoute({
    method: "get",
    path: "/challenges/next",
    request: {
      query: challengeSessionQuerySchema,
    },
    responses: {
      200: {
        content: jsonContent(challengeSessionResponseSchema),
        description: "Get the next flashcard challenge for practice or review",
      },
    },
    tags: challengesTag,
  }),
  restart: createRoute({
    method: "post",
    path: "/challenges/restart",
    responses: {
      200: {
        content: jsonContent(challengeRestartResponseSchema),
        description: "Reset current flashcard progress and start again",
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
    security: adminBearerSecurity,
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
