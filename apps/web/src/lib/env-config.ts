import { z } from "zod";

const withDefaultUrl = (defaultValue: string) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? defaultValue : value),
    z.url(),
  );

const envSchema = z.object({
  LOCAL_API_URL: withDefaultUrl("http://localhost:8080"),
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
