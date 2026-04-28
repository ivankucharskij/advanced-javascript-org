import { createMiddleware } from "hono/factory";

import type { User } from "../features/users/schemas.js";
import { usersStore } from "../features/users/store.js";

export type AuthVariables = {
  currentUser: User;
};

export const authMiddleware = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const auth = await usersStore.authorize(c.req.header("Authorization"));

  if (!auth.ok) {
    return c.json({ message: auth.message }, auth.status);
  }

  c.set("currentUser", auth.data);
  await next();
});
