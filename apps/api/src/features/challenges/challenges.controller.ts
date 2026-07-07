import { OpenAPIHono } from "@hono/zod-openapi";
import {
  challengeAnswerResponseSchema,
  challengeDashboardResponseSchema,
  challengeListResponseSchema,
  challengeRestartResponseSchema,
  challengeSessionResponseSchema,
  deleteChallengeResponseSchema,
  singleChallengeResponseSchema,
} from "@repo/shared-types";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";

import {
  adminMiddleware,
  type AdminVariables,
} from "../../middleware/admin.js";
import { AUTH_COOKIE_NAME } from "../../shared/constants.js";
import { authService } from "../auth/auth.service.js";
import {
  getGuestSessionId,
  setGuestSessionCookie,
} from "../guest-sessions/guest-sessions.controller.js";
import { guestSessionsService } from "../guest-sessions/guest-sessions.service.js";
import { challengesOpenApi } from "./challenges.openapi.js";
import { challengesService } from "./challenges.service.js";

export const challengesRouter = new OpenAPIHono<{
  Variables: AdminVariables;
}>();

const resolvePracticeActor = async (c: Context) => {
  const accessToken = getCookie(c, AUTH_COOKIE_NAME);
  const authorizationHeader =
    c.req.header("Authorization") ??
    (accessToken ? `Bearer ${accessToken}` : undefined);

  if (authorizationHeader) {
    const auth = await authService.authorize(authorizationHeader);

    if (auth.ok) {
      return {
        greetingName: auth.data.fullName,
        guestSessionId: null,
        userId: auth.data.id,
      };
    }
  }

  const result = await guestSessionsService.findOrCreate(getGuestSessionId(c));
  const { guestSession } = result.data;

  setGuestSessionCookie(c, guestSession.id);

  return {
    greetingName: null,
    guestSessionId: guestSession.id,
    userId: null,
  };
};

challengesRouter.openapi(challengesOpenApi.dashboard, async (c) => {
  const result = await challengesService.dashboard(
    await resolvePracticeActor(c),
  );

  return c.json(
    challengeDashboardResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.next, async (c) => {
  const result = await challengesService.next(
    await resolvePracticeActor(c),
    c.req.valid("query"),
  );

  return c.json(
    challengeSessionResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.answer, async (c) => {
  const result = await challengesService.answer(
    await resolvePracticeActor(c),
    c.req.valid("param").id,
    c.req.valid("json"),
  );

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    challengeAnswerResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.openapi(challengesOpenApi.restart, async (c) => {
  const result = await challengesService.restart(await resolvePracticeActor(c));

  return c.json(
    challengeRestartResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

challengesRouter.use("/challenges/*", adminMiddleware);
challengesRouter.use("/challenges", adminMiddleware);

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
