import { prisma, type User as PrismaUser } from "@repo/database/client";

import { createHttpResult, type HttpResult } from "../../shared/http-result.js";
import { HttpStatus } from "../../shared/http-status.js";
import { PaginationQuery } from "../../shared/schemas.js";
import { hashPassword, normalizeEmail, verifyPassword } from "./password.js";
import type { LoginUserInput, RegisterUserInput, User } from "./schemas.js";
import { createAccessToken, parseAccessToken } from "./tokens.js";

const toPublicUser = (user: PrismaUser): User => {
  return {
    id: user.id,
    fullName: user.fullName,
    birthDate: user.birthDate.toISOString().slice(0, 10),
    email: user.email,
    role: user.role === "ADMIN" ? "admin" : "user",
    status: user.status === "ACTIVE" ? "active" : "blocked",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const usersStore = {
  async register(
    input: RegisterUserInput,
  ): Promise<
    HttpResult<
      { accessToken: string; user: User },
      typeof HttpStatus.CONFLICT,
      typeof HttpStatus.CREATED
    >
  > {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(input.email),
      },
    });

    if (existingUser) {
      return createHttpResult({
        message: "User with this email already exists",
        status: HttpStatus.CONFLICT,
      });
    }

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        birthDate: new Date(`${input.birthDate}T00:00:00.000Z`),
        email: normalizeEmail(input.email),
        password: await hashPassword(input.password),
        role: "USER",
        status: "ACTIVE",
      },
    });

    return createHttpResult({
      status: HttpStatus.CREATED,
      data: {
        accessToken: await createAccessToken(user.id),
        user: toPublicUser(user),
      },
    });
  },
  async login(
    input: LoginUserInput,
  ): Promise<
    HttpResult<
      { accessToken: string; user: User },
      typeof HttpStatus.UNAUTHORIZED | typeof HttpStatus.FORBIDDEN,
      typeof HttpStatus.OK
    >
  > {
    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(input.email),
      },
    });

    if (!user || !(await verifyPassword(user.password, input.password))) {
      return createHttpResult({
        message: "Invalid email or password",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    if (user.status === "BLOCKED") {
      return createHttpResult({
        message: "User is blocked",
        status: HttpStatus.FORBIDDEN,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: {
        accessToken: await createAccessToken(user.id),
        user: toPublicUser(user),
      },
    });
  },
  async authorize(
    authorizationHeader?: string,
  ): Promise<
    HttpResult<
      User,
      typeof HttpStatus.UNAUTHORIZED | typeof HttpStatus.FORBIDDEN,
      typeof HttpStatus.OK
    >
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

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      return createHttpResult({
        message: "Invalid token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    if (user.status === "BLOCKED") {
      return createHttpResult({
        message: "User is blocked",
        status: HttpStatus.FORBIDDEN,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: toPublicUser(user),
    });
  },
  async getMany(
    currentUser: User,
    query: PaginationQuery,
  ): Promise<
    HttpResult<
      {
        data: User[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      typeof HttpStatus.FORBIDDEN,
      typeof HttpStatus.OK
    >
  > {
    if (currentUser.role !== "admin") {
      return createHttpResult({
        message: "Admin role required",
        status: HttpStatus.FORBIDDEN,
      });
    }

    const safePage = Math.max(query.page, 1);
    const safeLimit = Math.min(query.limit, 50);
    const skip = (safePage - 1) * safeLimit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: safeLimit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count(),
    ]);

    return createHttpResult({
      status: HttpStatus.OK,
      data: {
        data: users.map(toPublicUser),
        meta: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  },
  async getOne(
    currentUser: User,
    id: string,
  ): Promise<
    HttpResult<
      User,
      typeof HttpStatus.FORBIDDEN | typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    if (currentUser.role !== "admin" && currentUser.id !== id) {
      return createHttpResult({
        message: "Forbidden",
        status: HttpStatus.FORBIDDEN,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return createHttpResult({
        message: "User not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: toPublicUser(user),
    });
  },
  async block(
    currentUser: User,
    id: string,
  ): Promise<
    HttpResult<
      User,
      typeof HttpStatus.FORBIDDEN | typeof HttpStatus.NOT_FOUND | typeof HttpStatus.CONFLICT,
      typeof HttpStatus.OK
    >
  > {
    if (currentUser.role !== "admin") {
      return createHttpResult({
        message: "Forbidden",
        status: HttpStatus.FORBIDDEN,
      });
    }

    if (currentUser.id === id) {
      return createHttpResult({
        message: "Admin cannot block themselves",
        status: HttpStatus.CONFLICT,
      });
    }

    try {
      const blockedUser = await prisma.user.update({
        where: { id },
        data: {
          status: "BLOCKED",
        },
      });

      return createHttpResult({
        status: HttpStatus.OK,
        data: toPublicUser(blockedUser),
      });
    } catch {
      return createHttpResult({
        message: "User not found",
        status: HttpStatus.NOT_FOUND,
      });
    }
  },
};
