import { z } from "@hono/zod-openapi";

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
