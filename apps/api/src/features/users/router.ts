import { OpenAPIHono } from "@hono/zod-openapi";

import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { HttpStatus } from "../../shared/http-status.js";
import { authOpenApi, usersOpenApi } from "./openapi.js";
import { usersStore } from "./store.js";

export const authRouter = new OpenAPIHono();
export const usersRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

usersRouter.use("*", authMiddleware);

authRouter.openapi(authOpenApi.register, async (c) => {
  const input = c.req.valid("json");
  const result = await usersStore.register(input);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    {
      data: result.data,
    },
    HttpStatus.CREATED,
  );
});

authRouter.openapi(authOpenApi.login, async (c) => {
  const input = c.req.valid("json");
  const result = await usersStore.login(input);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    {
      data: result.data,
    },
    HttpStatus.OK,
  );
});

usersRouter.openapi(usersOpenApi.getMany, async (c) => {
  const query = c.req.valid("query");
  const result = await usersStore.getMany(c.var.currentUser, query);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(result.data, HttpStatus.OK);
});

usersRouter.openapi(usersOpenApi.getOne, async (c) => {
  const { id } = c.req.valid("param");
  const result = await usersStore.getOne(c.var.currentUser, id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});

usersRouter.openapi(usersOpenApi.block, async (c) => {
  const { id } = c.req.valid("param");
  const result = await usersStore.block(c.var.currentUser, id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});
