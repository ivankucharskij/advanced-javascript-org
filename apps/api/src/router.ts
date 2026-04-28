import { OpenAPIHono } from "@hono/zod-openapi";

import { healthRouter } from "./features/health/router.js";
import { tasksRouter } from "./features/tasks/router.js";
import { authRouter, usersRouter } from "./features/users/router.js";

export const createRouter = () => {
  const router = new OpenAPIHono();

  router.route("/", healthRouter);
  router.route("/auth", authRouter);
  router.route("/tasks", tasksRouter);
  router.route("/users", usersRouter);

  return router;
};
