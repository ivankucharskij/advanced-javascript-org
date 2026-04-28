import { createRoute } from "@hono/zod-openapi";

import {
  createTaskSchema,
  deleteManyTasksResponseSchema,
  deleteManyTasksSchema,
  singleTaskResponseSchema,
  taskIdParamsSchema,
  taskListResponseSchema,
  taskQuerySchema,
  tasksErrorResponseSchema,
  updateTaskSchema,
} from "./schemas.js";

const tasksTag = ["Tasks"];
const bearerSecurity = [{ bearerAuth: [] }];

export const tasksOpenApi = {
  getMany: createRoute({
    method: "get",
    path: "/",
    security: bearerSecurity,
    request: {
      query: taskQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: taskListResponseSchema,
          },
        },
        description: "List tasks",
      },
      401: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Forbidden",
      },
    },
    tags: tasksTag,
  }),
  post: createRoute({
    method: "post",
    path: "/",
    security: bearerSecurity,
    request: {
      body: {
        content: {
          "application/json": {
            schema: createTaskSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: singleTaskResponseSchema,
          },
        },
        description: "Create a task",
      },
      401: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Parent task not found",
      },
    },
    tags: tasksTag,
  }),
  deleteMany: createRoute({
    method: "delete",
    path: "/",
    security: bearerSecurity,
    request: {
      body: {
        content: {
          "application/json": {
            schema: deleteManyTasksSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: deleteManyTasksResponseSchema,
          },
        },
        description: "Delete multiple tasks",
      },
      401: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Forbidden",
      },
    },
    tags: tasksTag,
  }),
  getOne: createRoute({
    method: "get",
    path: "/{id}",
    security: bearerSecurity,
    request: {
      params: taskIdParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: singleTaskResponseSchema,
          },
        },
        description: "Get a task",
      },
      401: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Task not found",
      },
    },
    tags: tasksTag,
  }),
  patch: createRoute({
    method: "patch",
    path: "/{id}",
    security: bearerSecurity,
    request: {
      params: taskIdParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateTaskSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: singleTaskResponseSchema,
          },
        },
        description: "Update a task",
      },
      401: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: tasksErrorResponseSchema,
          },
        },
        description: "Task not found",
      },
    },
    tags: tasksTag,
  }),
};
