import { OpenAPIHono } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";

import { getEnv } from "../../config/env.js";
import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { HttpStatus } from "../../shared/http-status.js";
import { authOpenApi, usersOpenApi } from "./users.openapi.js";
import { usersService } from "./users.service.js";

const AUTH_COOKIE_NAME = "accessToken";
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const authRouter = new OpenAPIHono();
export const usersRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

usersRouter.use("*", authMiddleware);

authRouter.openapi(authOpenApi.register, async (c) => {
  const input = c.req.valid("json");
  const result = await usersService.register(input);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  setAuthCookie(c, result.data.accessToken);

  return c.json(
    {
      data: result.data,
    },
    HttpStatus.CREATED,
  );
});

authRouter.openapi(authOpenApi.login, async (c) => {
  const input = c.req.valid("json");
  const result = await usersService.login(input);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  setAuthCookie(c, result.data.accessToken);

  return c.json(
    {
      data: result.data,
    },
    HttpStatus.OK,
  );
});

usersRouter.openapi(usersOpenApi.getMany, async (c) => {
  const query = c.req.valid("query");
  const result = await usersService.getMany(c.var.currentUser, query);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(result.data, HttpStatus.OK);
});

usersRouter.openapi(usersOpenApi.getOne, async (c) => {
  const { id } = c.req.valid("param");
  const result = await usersService.getOne(c.var.currentUser, id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});

usersRouter.openapi(usersOpenApi.block, async (c) => {
  const { id } = c.req.valid("param");
  const result = await usersService.block(c.var.currentUser, id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});

const setAuthCookie = (
  c: Parameters<typeof setCookie>[0],
  accessToken: string,
) => {
  setCookie(c, AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "Lax",
    secure: getEnv().NODE_ENV === "production",
  });
};
