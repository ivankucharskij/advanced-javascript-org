import { z } from "@hono/zod-openapi";

export type GuestSessionSummary = {
  id: string;
  createdAt: string;
  updatedAt: string;
  progressCount: number;
  totalAnswered: number;
  needsReviewCount: number;
};

export type GuestSessionResponse = {
  data: GuestSessionSummary | null;
};

export type StartGuestSessionResponse = {
  data: GuestSessionSummary & {
    created: boolean;
  };
};

export type DiscardGuestSessionResponse = {
  data: {
    discarded: boolean;
    id: string | null;
  };
};

const guestSessionSummaryBaseSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  progressCount: z.number().int().min(0),
  totalAnswered: z.number().int().min(0),
  needsReviewCount: z.number().int().min(0),
});

export const guestSessionSummarySchema: z.ZodType<GuestSessionSummary> =
  guestSessionSummaryBaseSchema;

export const guestSessionResponseSchema: z.ZodType<GuestSessionResponse> =
  z.object({
    data: guestSessionSummarySchema.nullable(),
  });

export const startGuestSessionResponseSchema: z.ZodType<StartGuestSessionResponse> =
  z.object({
    data: guestSessionSummaryBaseSchema.extend({
      created: z.boolean(),
    }),
  });

export const discardGuestSessionResponseSchema: z.ZodType<DiscardGuestSessionResponse> =
  z.object({
    data: z.object({
      discarded: z.boolean(),
      id: z.uuid().nullable(),
    }),
  });
