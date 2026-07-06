import { createMiddleware } from "hono/factory";

import { parseAdminAccessToken } from "../features/auth/tokens.js";
import { HttpStatus } from "../shared/http.js";

export type AdminVariables = {
  currentAdmin: {
    sub: "admin";
  };
};

export const adminMiddleware = createMiddleware<{
  Variables: AdminVariables;
}>(async (c, next) => {
  const authorizationHeader = c.req.header("Authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return c.json(
      { message: "Missing admin access token" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();
  const admin = await parseAdminAccessToken(token);

  if (!admin) {
    return c.json(
      { message: "Invalid admin access token" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  c.set("currentAdmin", admin);
  await next();
});
