import { OpenAPIHono } from "@hono/zod-openapi";

import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { HttpStatus } from "../../shared/http-status.js";
import { tasksOpenApi } from "./tasks.openapi.js";
import { tasksService } from "./tasks.service.js";

export const tasksRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

tasksRouter.use("*", authMiddleware);

tasksRouter.openapi(tasksOpenApi.post, async (c) => {
  const input = c.req.valid("json");
  const result = await tasksService.post(c.var.currentUser, input);

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

tasksRouter.openapi(tasksOpenApi.getMany, async (c) => {
  const query = c.req.valid("query");

  return c.json(
    await tasksService.getMany(c.var.currentUser, query),
    HttpStatus.OK,
  );
});

tasksRouter.openapi(tasksOpenApi.getOne, async (c) => {
  const { id } = c.req.valid("param");
  const result = await tasksService.getOne(c.var.currentUser, id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});

tasksRouter.openapi(tasksOpenApi.patch, async (c) => {
  const { id } = c.req.valid("param");
  const input = c.req.valid("json");
  const result = await tasksService.patch(c.var.currentUser, id, input);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json({ data: result.data }, HttpStatus.OK);
});

tasksRouter.openapi(tasksOpenApi.deleteMany, async (c) => {
  const input = c.req.valid("json");

  return c.json(
    await tasksService.deleteMany(c.var.currentUser, input),
    HttpStatus.OK,
  );
});
