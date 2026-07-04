import { OpenAPIHono } from "@hono/zod-openapi";
import {
  challengeSnippetListResponseSchema,
  deleteChallengeSnippetResponseSchema,
  singleChallengeSnippetResponseSchema,
} from "@repo/shared-types";

import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import { challengeSnippetsOpenApi } from "./challenge-snippets.openapi.js";
import { challengeSnippetsService } from "./challenge-snippets.service.js";

export const challengeSnippetsRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

challengeSnippetsRouter.use("/challenge-snippets/*", authMiddleware);
challengeSnippetsRouter.use("/challenge-snippets", authMiddleware);

challengeSnippetsRouter.openapi(challengeSnippetsOpenApi.list, async (c) => {
  const result = await challengeSnippetsService.list(c.req.valid("query"));

  return c.json(
    challengeSnippetListResponseSchema.parse({
      data: result.data,
      meta: result.meta,
    }),
    result.status,
  );
});

challengeSnippetsRouter.openapi(challengeSnippetsOpenApi.create, async (c) => {
  const result = await challengeSnippetsService.create(c.req.valid("json"));

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    singleChallengeSnippetResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengeSnippetsRouter.openapi(challengeSnippetsOpenApi.update, async (c) => {
  const result = await challengeSnippetsService.update(
    c.req.valid("param").id,
    c.req.valid("json"),
  );

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    singleChallengeSnippetResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengeSnippetsRouter.openapi(challengeSnippetsOpenApi.delete, async (c) => {
  const result = await challengeSnippetsService.delete(c.req.valid("param").id);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    deleteChallengeSnippetResponseSchema.parse(result.data),
    result.status,
  );
});
