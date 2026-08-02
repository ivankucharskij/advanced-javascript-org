import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const envPath = "apps/api/.env.production.local";
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

const parseEnvFile = (path) => {
  const entries = {};
  const text = readFileSync(path, "utf8");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
};

const getIamToken = () => {
  const result = spawnSync("yc", ["iam", "create-token"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

  if (result.error) {
    console.error(
      "Failed to run `yc iam create-token`. Make sure Yandex Cloud CLI is installed and available on PATH.",
    );
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error("Failed to get IAM token with `yc iam create-token`.");
    process.exit(result.status ?? 1);
  }

  const token = result.stdout.trim();

  if (!token) {
    console.error("`yc iam create-token` returned an empty token.");
    process.exit(1);
  }

  return token;
};

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
