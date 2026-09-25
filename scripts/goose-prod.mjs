import { spawnSync } from "node:child_process";

import { getIamToken, parseEnvFile, prodEnvPath as envPath } from "./prod-env.mjs";

const migrationDir = "apps/api/db/migrations";
const command = process.argv[2] ?? "up";
const allowedCommands = new Set([
  "down",
  "redo",
  "status",
  "up",
  "up-by-one",
  "version",
]);

if (!allowedCommands.has(command)) {
  console.error(`Unsupported prod migration command: ${command}`);
  process.exit(1);
}

const buildDbString = (baseDbString, token) => {
  const url = new URL(baseDbString);

  url.searchParams.set("go_query_mode", "scripting");
  url.searchParams.set("go_fake_tx", "scripting");
  url.searchParams.set("go_query_bind", "declare,numeric");
  url.searchParams.set("token", token);

  return url.toString();
};

const env = parseEnvFile(envPath);
const dbString = env.GOOSE_DBSTRING;

if (!dbString) {
  console.error(`GOOSE_DBSTRING is missing in ${envPath}.`);
  process.exit(1);
}

const token = getIamToken();
const prodDbString = buildDbString(dbString, token);
const gooseArgs = [
  "-dir",
  env.GOOSE_MIGRATION_DIR || migrationDir,
  "-table",
  env.GOOSE_TABLE || "goose_db_version",
  "ydb",
  prodDbString,
  command,
];

const result = spawnSync("goose", gooseArgs, {
  env: process.env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
