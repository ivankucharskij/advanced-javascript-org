import { z } from "@hono/zod-openapi";

export const healthCheckResponseSchema = z
  .object({
    status: z.literal("ok"),
  });
