import { OpenAPIHono } from "@hono/zod-openapi";

import { authRouter } from "./features/auth/auth.controller.js";
import { healthRouter } from "./features/health/health.controller.js";

export const createRouter = () => {
  const router = new OpenAPIHono();

  router.route("/api/", healthRouter);
  router.route("/api", authRouter);

  return router;
};
