import { OpenAPIHono } from "@hono/zod-openapi";
import {
  challengeListResponseSchema,
  deleteChallengeResponseSchema,
  singleChallengeResponseSchema,
} from "@repo/shared-types";

import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { challengesOpenApi } from "./challenges.openapi.js";
import { challengesService } from "./challenges.service.js";

export const challengesRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

challengesRouter.use("/challenges/*", authMiddleware);
challengesRouter.use("/challenges", authMiddleware);

challengesRouter.openapi(challengesOpenApi.list, async (c) => {
  const result = await challengesService.list(c.req.valid("query"));

  return c.json(
    challengeListResponseSchema.parse({
      data: result.data,
      meta: result.meta,
    }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.create, async (c) => {
  const result = await challengesService.create(c.req.valid("json"));

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    singleChallengeResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.update, async (c) => {
  const result = await challengesService.update(
    c.req.valid("param").id,
    c.req.valid("json"),
  );

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    singleChallengeResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.delete, async (c) => {
  const result = await challengesService.delete(c.req.valid("param").id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(deleteChallengeResponseSchema.parse(result.data), result.status);
});
