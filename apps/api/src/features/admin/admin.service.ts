import { createHash, timingSafeEqual } from "node:crypto";

import type { AdminSessionResponse } from "@repo/shared-types";

import { getEnv } from "../../config/env.js";
import {
  createHttpResult,
  type HttpResult,
  HttpStatus,
} from "../../shared/http.js";
import {
  ADMIN_ACCESS_TOKEN_TTL_SECONDS,
  createAdminAccessToken,
} from "../auth/tokens.js";

const hashSecret = (value: string) =>
  createHash("sha256").update(value).digest();

const constantTimeEquals = (actual: string, expected: string) => {
  return timingSafeEqual(hashSecret(actual), hashSecret(expected));
};

export const adminService = {
  async createSession(
    code: string,
  ): Promise<
    HttpResult<
      AdminSessionResponse["data"],
      never,
      typeof HttpStatus.UNAUTHORIZED,
      typeof HttpStatus.OK
    >
  > {
    if (!constantTimeEquals(code, getEnv().ADMIN_CODE)) {
      return createHttpResult({
        message: "Invalid admin code",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    return createHttpResult({
      data: {
        accessToken: await createAdminAccessToken(),
        expiresAt: new Date(
          Date.now() + ADMIN_ACCESS_TOKEN_TTL_SECONDS * 1000,
        ).toISOString(),
      },
      status: HttpStatus.OK,
    });
  },
};
