import { OpenAPIHono } from "@hono/zod-openapi";

import { authRouter } from "./features/auth/auth.controller.js";
import { challengeSnippetsRouter } from "./features/challenge-snippets/challenge-snippets.controller.js";
import { challengesRouter } from "./features/challenges/challenges.controller.js";
import { guestSessionsRouter } from "./features/guest-sessions/guest-sessions.controller.js";
import { healthRouter } from "./features/health/health.controller.js";

export const createRouter = () => {
  const router = new OpenAPIHono();

  router.route("/api", healthRouter);
  router.route("/api", authRouter);
  router.route("/api", guestSessionsRouter);
  router.route("/api", challengeSnippetsRouter);
  router.route("/api", challengesRouter);

  return router;
};
