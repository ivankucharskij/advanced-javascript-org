import { z } from "@hono/zod-openapi";

export type HealthCheckResponse = {
  status: "healthy";
};

export const healthCheckResponseSchema: z.ZodType<HealthCheckResponse> = z.object({
  status: z.literal("healthy"),
});
