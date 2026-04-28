import { z } from "@hono/zod-openapi";

import { paginationMetaSchema } from "../../shared/schemas.js";

export const userRoleSchema = z.enum(["admin", "user"]);

export const userStatusSchema = z.enum(["active", "blocked"]);

export const userSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
  birthDate: z.iso.date(),
  email: z.email(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const registerUserSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.iso.date(),
  email: z.email(),
  password: z.string().min(8),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const authResponseSchema = z.object({
  data: z.object({
    accessToken: z.string().min(1),
    user: userSchema,
  }),
});

export const singleUserResponseSchema = z.object({
  data: userSchema,
});

export const userListResponseSchema = z.object({
  data: z.array(userSchema),
  meta: paginationMetaSchema,
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type User = z.infer<typeof userSchema>;
