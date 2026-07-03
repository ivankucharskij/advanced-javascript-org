import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: z.url().min(1, "DATABASE_URL is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REDIRECT_URI: z.url().min(1, "GOOGLE_REDIRECT_URI is required"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.preprocess(
    (value) => (value === undefined || value === "" ? "8080" : value),
    z.coerce.number().int().min(1).max(65535),
  ),
  WEB_ORIGIN: z.preprocess(emptyStringToUndefined, z.url().optional()),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = () => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${result.error}`);
  }

  cachedEnv = result.data;

  return cachedEnv;
};
