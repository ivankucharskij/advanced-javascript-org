const getRequiredEnv = (name: "AUTH_SECRET") => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  if (name === "AUTH_SECRET" && value.length < 32) {
    throw new Error(`${name} must be at least 32 characters`);
  }

  return value;
};

const getPort = () => {
  const rawPort = process.env.PORT ?? "8080";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
};

export const getEnv = () =>
  ({
    AUTH_SECRET: getRequiredEnv("AUTH_SECRET"),
    PORT: getPort(),
    WEB_ORIGIN: process.env.WEB_ORIGIN,
  }) as const;
