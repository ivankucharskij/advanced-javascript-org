import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";

export const startServer = async () => {
  const runtimeEnv = getEnv();

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
  process.exit(1);
});
