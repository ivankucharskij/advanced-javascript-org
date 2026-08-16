import { z } from "@hono/zod-openapi";

export type HealthCheckResponse = {
  db: "fail" | "ok";
  status: "healthy" | "unhealthy";
};

export const healthCheckResponseSchema: z.ZodType<HealthCheckResponse> =
  z.object({
    db: z.enum(["fail", "ok"]),
    status: z.enum(["healthy", "unhealthy"]),
  });
