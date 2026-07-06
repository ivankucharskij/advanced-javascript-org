import { sign, verify } from "hono/jwt";

import { getEnv } from "../../config/env.js";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const ADMIN_ACCESS_TOKEN_TTL_SECONDS = 12 * 60 * 60;
const ADMIN_TOKEN_AUDIENCE = "admin";
const ADMIN_TOKEN_SCOPE = "admin";

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

export const createAdminAccessToken = () => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + ADMIN_ACCESS_TOKEN_TTL_SECONDS;

  return sign(
    {
      aud: ADMIN_TOKEN_AUDIENCE,
      exp: expiresAt,
      iat: now,
      scope: ADMIN_TOKEN_SCOPE,
      sub: "admin",
    },
    getEnv().AUTH_SECRET,
  );
};

export const parseAdminAccessToken = async (token: string) => {
  try {
    const payload = await verify(token, getEnv().AUTH_SECRET, "HS256");

    return payload.sub === "admin" &&
      payload.aud === ADMIN_TOKEN_AUDIENCE &&
      payload.scope === ADMIN_TOKEN_SCOPE
      ? { sub: "admin" as const }
      : null;
  } catch {
    return null;
  }
};
