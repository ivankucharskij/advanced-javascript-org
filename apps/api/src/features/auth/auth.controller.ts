import { OpenAPIHono } from "@hono/zod-openapi";

import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { HttpStatus } from "../../shared/http-status.js";
import { authOpenApi } from "./auth.openapi.js";

export const authRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

authRouter.use("/me", authMiddleware);

authRouter.openapi(authOpenApi.me, (c) => {
  return c.json({ data: c.var.currentUser }, HttpStatus.OK);
});
