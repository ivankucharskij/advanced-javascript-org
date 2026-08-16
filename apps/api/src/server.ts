import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { closeDb } from "./lib/db.js";

export const startServer = async () => {
  const runtimeEnv = getEnv();

  const app = createApp(runtimeEnv);

  const server = serve({
    fetch: app.fetch,
    port: runtimeEnv.PORT,
  });

  console.log(`API listening on http://localhost:${runtimeEnv.PORT}`);

  const shutdown = () => {
    server.close();
    closeDb();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

startServer().catch((error) => {
  const message =
    error instanceof Error
      ? (error.stack ?? error.message)
      : "Unknown startup error";

  console.error(`API failed to start: ${message}`);
  process.exit(1);
});
