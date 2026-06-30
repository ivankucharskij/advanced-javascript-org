import type { User } from "@repo/shared-types";

import type { User as PrismaUser } from "../../lib/prisma.js";
import { createHttpResult, type HttpResult } from "../../shared/http-result.js";
import { HttpStatus } from "../../shared/http-status.js";
import { authRepository } from "./auth.repository.js";
import { parseAccessToken } from "./tokens.js";

const toPublicUser = (user: PrismaUser): User => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const authService = {
  async authorize(
    authorizationHeader?: string,
  ): Promise<
    HttpResult<User, typeof HttpStatus.UNAUTHORIZED, typeof HttpStatus.OK>
  > {
    if (!authorizationHeader?.startsWith("Bearer ")) {
      return createHttpResult({
        message: "Missing access token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    const payload = await parseAccessToken(token);

    if (!payload?.sub) {
      return createHttpResult({
        message: "Invalid token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const user = await authRepository.findUserById(payload.sub);

    if (!user) {
      return createHttpResult({
        message: "Invalid token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: toPublicUser(user),
    });
  },
};
