import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const configDir = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: join(configDir, ".env"), quiet: true });

const isDeployMigration =
  process.argv.includes("migrate") && process.argv.includes("deploy");

const withConnectTimeout = (url: string | undefined) => {
  if (!url) {
    return url;
  }

  const parsedUrl = new URL(url);

  if (!parsedUrl.searchParams.has("connect_timeout")) {
    parsedUrl.searchParams.set("connect_timeout", "30");
  }

  return parsedUrl.toString();
};

const databaseUrl = isDeployMigration
  ? (process.env["DATABASE_URL_NEON"] ?? process.env["DATABASE_URL"])
  : process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isDeployMigration ? withConnectTimeout(databaseUrl) : databaseUrl,
  },
});
