import { sign, verify } from "hono/jwt";

import { getEnv } from "../../config/env.js";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;

export const createAccessToken = (userId: string) => {
  const now = Math.floor(Date.now() / 1000);

  return sign(
    {
      sub: userId,
      iat: now,
      exp: now + ACCESS_TOKEN_TTL_SECONDS,
    },
    getEnv().AUTH_SECRET,
  );
};

export const parseAccessToken = async (token: string) => {
  try {
    const payload = await verify(token, getEnv().AUTH_SECRET, "HS256");

    return typeof payload.sub === "string" ? { sub: payload.sub } : null;
  } catch {
    return null;
  }
};
