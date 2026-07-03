import type { User } from "@repo/shared-types";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { authService } from "../features/auth/auth.service.js";
import { AUTH_COOKIE_NAME } from "../shared/constants.js";

export type AuthVariables = {
  currentUser: User;
};

export const authMiddleware = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const accessToken = getCookie(c, AUTH_COOKIE_NAME);
  const auth = await authService.authorize(
    c.req.header("Authorization") ??
      (accessToken ? `Bearer ${accessToken}` : undefined),
  );

  if (!auth.ok) {
    return c.json({ message: auth.message }, auth.status);
  }

  c.set("currentUser", auth.data);
  await next();
});
