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

export type GoogleCallbackResponse = {
  data: {
    accessToken: string;
    guestSessionMerge: {
      discarded: boolean;
      guestSessionId: string | null;
      mergedProgressCount: number;
    };
    user: User;
  };
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

export const googleCallbackResponseSchema: z.ZodType<GoogleCallbackResponse> =
  z.object({
    data: z.object({
      accessToken: z.string().min(1),
      guestSessionMerge: z.object({
        discarded: z.boolean(),
        guestSessionId: z.uuid().nullable(),
        mergedProgressCount: z.number().int().min(0),
      }),
      user: userSchema,
    }),
  });
