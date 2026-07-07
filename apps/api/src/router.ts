import { OpenAPIHono } from "@hono/zod-openapi";

import { adminRouter } from "./features/admin/admin.controller.js";
import { authRouter } from "./features/auth/auth.controller.js";
import { challengeSnippetsRouter } from "./features/challenge-snippets/challenge-snippets.controller.js";
import { challengesRouter } from "./features/challenges/challenges.controller.js";
import { guestSessionsRouter } from "./features/guest-sessions/guest-sessions.controller.js";
import { healthRouter } from "./features/health/health.controller.js";

export const createRouter = () => {
  const router = new OpenAPIHono();

  router.route("/", healthRouter);
  router.route("/", adminRouter);
  router.route("/", authRouter);
  router.route("/", guestSessionsRouter);
  router.route("/", challengeSnippetsRouter);
  router.route("/", challengesRouter);

  return router;
};
