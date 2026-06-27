import type { User } from "@repo/shared-types/features/users/users.schemas";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { usersService } from "../features/users/users.service.js";

const AUTH_COOKIE_NAME = "accessToken";

export type AuthVariables = {
  currentUser: User;
};

export const authMiddleware = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const accessToken = getCookie(c, AUTH_COOKIE_NAME);
  const auth = await usersService.authorize(
    c.req.header("Authorization") ??
      (accessToken ? `Bearer ${accessToken}` : undefined),
  );

  if (!auth.ok) {
    return c.json({ message: auth.message }, auth.status);
  }

  c.set("currentUser", auth.data);
  await next();
});
