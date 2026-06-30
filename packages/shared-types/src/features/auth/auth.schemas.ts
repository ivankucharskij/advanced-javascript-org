import { z } from "@hono/zod-openapi";

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MeResponse = {
  data: User;
};

export const userSchema: z.ZodType<User> = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
  email: z.email(),
  avatarUrl: z.url().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const meResponseSchema: z.ZodType<MeResponse> = z.object({
  data: userSchema,
});
