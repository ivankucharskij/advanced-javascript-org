import { createRoute } from "@hono/zod-openapi";

import {
  errorResponseSchema,
  paginationQuerySchema,
} from "../../shared/schemas.js";
import {
  authResponseSchema,
  loginUserSchema,
  registerUserSchema,
  singleUserResponseSchema,
  userIdParamsSchema,
  userListResponseSchema,
} from "./users.schemas.js";

const authTag = ["Auth"];
const usersTag = ["Users"];
const bearerSecurity = [{ bearerAuth: [] }];

export const authOpenApi = {
  register: createRoute({
    method: "post",
    path: "/register",
    request: {
      body: {
        content: {
          "application/json": {
            schema: registerUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: authResponseSchema,
          },
        },
        description: "Register a user",
      },
      409: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Email already exists",
      },
    },
    tags: authTag,
  }),
  login: createRoute({
    method: "post",
    path: "/login",
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: authResponseSchema,
          },
        },
        description: "Login a user",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Invalid credentials",
      },
      403: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "User is blocked",
      },
    },
    tags: authTag,
  }),
};

export const usersOpenApi = {
  getMany: createRoute({
    method: "get",
    path: "/",
    security: bearerSecurity,
    request: {
      query: paginationQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: userListResponseSchema,
          },
        },
        description: "List users",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Forbidden",
      },
    },
    tags: usersTag,
  }),
  getOne: createRoute({
    method: "get",
    path: "/{id}",
    security: bearerSecurity,
    request: {
      params: userIdParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: singleUserResponseSchema,
          },
        },
        description: "Get a user by id",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "User not found",
      },
    },
    tags: usersTag,
  }),
  block: createRoute({
    method: "patch",
    path: "/{id}/block",
    security: bearerSecurity,
    request: {
      params: userIdParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: singleUserResponseSchema,
          },
        },
        description: "Block a user",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "User not found",
      },
      409: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Admin cannot block themselves",
      },
    },
    tags: usersTag,
  }),
};
