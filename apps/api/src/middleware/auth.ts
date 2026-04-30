import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import type { User } from "../features/users/schemas.js";
import { usersStore } from "../features/users/store.js";

const AUTH_COOKIE_NAME = "accessToken";

export type AuthVariables = {
  currentUser: User;
};

export const authMiddleware = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const accessToken = getCookie(c, AUTH_COOKIE_NAME);
  const auth = await usersStore.authorize(
    c.req.header("Authorization") ??
      (accessToken ? `Bearer ${accessToken}` : undefined),
  );

  if (!auth.ok) {
    return c.json({ message: auth.message }, auth.status);
  }

  c.set("currentUser", auth.data);
  await next();
});
