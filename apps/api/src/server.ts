import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const assertDatabaseAvailable = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

export const startServer = async () => {
  const runtimeEnv = getEnv();

  await assertDatabaseAvailable();

  const app = createApp(runtimeEnv);

  serve({
    fetch: app.fetch,
    port: runtimeEnv.PORT,
  });

  console.log(`API listening on http://localhost:${runtimeEnv.PORT}`);
};

startServer().catch((error) => {
  const message =
    error instanceof Error
      ? (error.stack ?? error.message)
      : "Unknown startup error";

  console.error(`API failed to start: ${message}`);
  process.exitCode = 1;
});
