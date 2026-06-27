import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "../../shared/schemas.js";

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "blocked";

export type User = {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type RegisterUserInput = {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type UserIdParams = {
  id: string;
};

export type AuthResponse = {
  data: {
    accessToken: string;
    user: User;
  };
};

export type SingleUserResponse = {
  data: User;
};

export type UserListResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const userRoleSchema: z.ZodType<UserRole> = z.enum(["admin", "user"]);

export const userStatusSchema: z.ZodType<UserStatus> = z.enum([
  "active",
  "blocked",
]);

export const userSchema: z.ZodType<User> = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
  birthDate: z.iso.date(),
  email: z.email(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const registerUserSchema: z.ZodType<RegisterUserInput> = z.object({
  fullName: z.string().min(1),
  birthDate: z.iso.date(),
  email: z.email(),
  password: z.string().min(8),
});

export const loginUserSchema: z.ZodType<LoginUserInput> = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const authResponseSchema: z.ZodType<AuthResponse> = z.object({
  data: z.object({
    accessToken: z.string().min(1),
    user: userSchema,
  }),
});

export const singleUserResponseSchema: z.ZodType<SingleUserResponse> = z.object({
  data: userSchema,
});

export const userListResponseSchema: z.ZodType<UserListResponse> = z.object({
  data: z.array(userSchema),
  meta: paginationMetaSchema,
});
