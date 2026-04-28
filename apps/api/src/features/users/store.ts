import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { prisma, type User as PrismaUser } from "@repo/database/client";

import { createHttpResult, type HttpResult } from "../../shared/http-result.js";
import { HttpStatus } from "../../shared/http-status.js";
import { PaginationQuery } from "../../shared/schemas.js";
import type { LoginUserInput, RegisterUserInput, User } from "./schemas.js";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin12345";
const DEFAULT_ADMIN_FULL_NAME =
  process.env.ADMIN_FULL_NAME ?? "System Administrator";
const DEFAULT_ADMIN_BIRTH_DATE = process.env.ADMIN_BIRTH_DATE ?? "1990-01-01";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "local-dev-auth-secret";

const hashPassword = (password: string) => {
  return createHash("sha256").update(password).digest("hex");
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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

const createToken = (userId: string) => {
  const payload = Buffer.from(JSON.stringify({ sub: userId }), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

const parseToken = (token: string): { sub: string } | null => {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub: string;
    };
  } catch {
    return null;
  }
};

const ensureDefaultAdmin = async () => {
  await prisma.user.upsert({
    where: {
      email: normalizeEmail(DEFAULT_ADMIN_EMAIL),
    },
    update: {},
    create: {
      fullName: DEFAULT_ADMIN_FULL_NAME,
      birthDate: new Date(`${DEFAULT_ADMIN_BIRTH_DATE}T00:00:00.000Z`),
      email: normalizeEmail(DEFAULT_ADMIN_EMAIL),
      password: hashPassword(DEFAULT_ADMIN_PASSWORD),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
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
    await ensureDefaultAdmin();

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
        password: hashPassword(input.password),
        role: "USER",
        status: "ACTIVE",
      },
    });

    return createHttpResult({
      status: HttpStatus.CREATED,
      data: {
        accessToken: createToken(user.id),
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
    await ensureDefaultAdmin();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(input.email),
      },
    });

    if (!user || user.password !== hashPassword(input.password)) {
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
        accessToken: createToken(user.id),
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
        message: "Missing bearer token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    const payload = parseToken(token);

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
