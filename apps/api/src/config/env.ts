import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

const envSchema = z.object({
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.preprocess(
    (value) => (value === undefined || value === "" ? "8080" : value),
    z.coerce.number().int().min(1).max(65535),
  ),
  WEB_ORIGIN: z.preprocess(
    emptyStringToUndefined,
    z.url().optional(),
  ),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

const formatEnvError = (error: z.ZodError) =>
  error.issues
    .map((issue) => {
      const name = issue.path.join(".") || "env";

      return `${name}: ${issue.message}`;
    })
    .join("; ");

export const getEnv = () => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${formatEnvError(result.error)}`,
    );
  }

  cachedEnv = result.data;

  return cachedEnv;
};
