import { OpenAPIHono } from "@hono/zod-openapi";
import {
  discardGuestSessionResponseSchema,
  guestSessionResponseSchema,
  startGuestSessionResponseSchema,
} from "@repo/shared-types";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { getEnv } from "../../config/env.js";
import {
  GUEST_SESSION_COOKIE_MAX_AGE_SECONDS,
  GUEST_SESSION_COOKIE_NAME,
} from "../../shared/constants.js";
import { guestSessionsOpenApi } from "./guest-sessions.openapi.js";
import { guestSessionsService } from "./guest-sessions.service.js";

export const guestSessionsRouter = new OpenAPIHono();

const getGuestSessionId = (c: Parameters<typeof getCookie>[0]) => {
  return getCookie(c, GUEST_SESSION_COOKIE_NAME);
};

const setGuestSessionCookie = (
  c: Parameters<typeof setCookie>[0],
  guestSessionId: string,
) => {
  setCookie(c, GUEST_SESSION_COOKIE_NAME, guestSessionId, {
    httpOnly: true,
    maxAge: GUEST_SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "Lax",
    secure: getEnv().NODE_ENV === "production",
  });
};

const clearGuestSessionCookie = (c: Parameters<typeof deleteCookie>[0]) => {
  deleteCookie(c, GUEST_SESSION_COOKIE_NAME, {
    path: "/",
    sameSite: "Lax",
    secure: getEnv().NODE_ENV === "production",
  });
};

export { clearGuestSessionCookie, getGuestSessionId, setGuestSessionCookie };

guestSessionsRouter.openapi(guestSessionsOpenApi.current, async (c) => {
  const result = await guestSessionsService.find(getGuestSessionId(c));

  return c.json(
    guestSessionResponseSchema.parse({ data: result.data }),
    result.status,
  );
});

guestSessionsRouter.openapi(guestSessionsOpenApi.start, async (c) => {
  const result = await guestSessionsService.findOrCreate(
    getGuestSessionId(c),
  );

  const { created, guestSession } = result.data;

  setGuestSessionCookie(c, guestSession.id);

  return c.json(
    startGuestSessionResponseSchema.parse({
      data: {
        ...guestSession,
        created,
      },
    }),
    result.status,
  );
});

guestSessionsRouter.openapi(guestSessionsOpenApi.discard, async (c) => {
  const result = await guestSessionsService.discard(getGuestSessionId(c));

  clearGuestSessionCookie(c);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    discardGuestSessionResponseSchema.parse({ data: result.data }),
    result.status,
  );
});
