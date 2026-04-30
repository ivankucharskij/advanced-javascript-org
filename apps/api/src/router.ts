import { OpenAPIHono } from "@hono/zod-openapi";

import { healthRouter } from "./features/health/router.js";
import { tasksRouter } from "./features/tasks/router.js";
import { authRouter, usersRouter } from "./features/users/router.js";

export const createRouter = () => {
  const router = new OpenAPIHono();

  router.route("/api/", healthRouter);
  router.route("/api/auth", authRouter);
  router.route("/api/tasks", tasksRouter);
  router.route("/api/users", usersRouter);

  return router;
};
