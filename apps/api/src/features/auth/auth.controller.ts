import { googleAuth } from "@hono/oauth-providers/google";
import { OpenAPIHono } from "@hono/zod-openapi";
import { googleCallbackResponseSchema } from "@repo/shared-types";
import type { MiddlewareHandler } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

import { getEnv } from "../../config/env.js";
import { authMiddleware, type AuthVariables } from "../../middleware/auth.js";
import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_COOKIE_NAME,
} from "../../shared/constants.js";
import { HttpStatus } from "../../shared/http.js";
import {
  clearGuestSessionCookie,
  getGuestSessionId,
} from "../guest-sessions/guest-sessions.controller.js";
import { authOpenApi } from "./auth.openapi.js";
import { authService } from "./auth.service.js";

export const authRouter = new OpenAPIHono<{
  Variables: AuthVariables;
}>();

const googleOAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const runtimeEnv = getEnv();
  const middleware = googleAuth({
    client_id: runtimeEnv.GOOGLE_CLIENT_ID,
    client_secret: runtimeEnv.GOOGLE_CLIENT_SECRET,
    redirect_uri: runtimeEnv.GOOGLE_REDIRECT_URI,
    scope: ["openid", "email", "profile"],
  });

  try {
    return await middleware(c, next);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json(
        { message: error.message || "Google OAuth failed" },
        error.status,
      );
    }

    const message =
      error instanceof Error && error.message === "fetch failed"
        ? "Google OAuth provider is unavailable"
        : "Google OAuth failed";

    return c.json({ message }, HttpStatus.BAD_GATEWAY);
  }
};

authRouter.use("/me", authMiddleware);

authRouter.openapi(
  { ...authOpenApi.google, middleware: googleOAuthMiddleware },
  (c) => {
    return c.redirect(getEnv().GOOGLE_REDIRECT_URI);
  },
);

authRouter.openapi(
  { ...authOpenApi.googleCallback, middleware: googleOAuthMiddleware },
  async (c) => {
    const auth = await authService.signInWithGoogle(
      c.get("user-google"),
      getGuestSessionId(c),
    );

    if (!auth.ok) {
      return c.json({ message: auth.message }, auth.status);
    }

    const runtimeEnv = getEnv();

    setCookie(c, AUTH_COOKIE_NAME, auth.data.accessToken, {
      httpOnly: true,
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "Lax",
      secure: runtimeEnv.NODE_ENV === "production",
    });

    if (auth.data.guestSessionMerge.discarded) {
      clearGuestSessionCookie(c);
    }

    return c.json(
      googleCallbackResponseSchema.parse({ data: auth.data }),
      HttpStatus.OK,
    );
  },
);

authRouter.openapi(authOpenApi.me, (c) => {
  return c.json({ data: c.var.currentUser }, HttpStatus.OK);
});
