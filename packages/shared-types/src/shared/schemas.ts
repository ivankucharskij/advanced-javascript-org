import { z } from "@hono/zod-openapi";

export type ErrorResponse = {
  message: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginationQuery = {
  page: number;
  limit: number;
};

export const errorResponseSchema: z.ZodType<ErrorResponse> = z.object({
  message: z.string(),
});

export const paginationMetaSchema: z.ZodType<PaginationMeta> = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});
