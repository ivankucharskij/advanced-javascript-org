import { spawnSync } from "node:child_process";

import { getIamToken, parseEnvFile, prodEnvPath as envPath } from "./prod-env.mjs";

const target = process.argv[2] ?? "all";
const seedScripts = {
  all: ["seed", "seed:challenges"],
  challenges: ["seed:challenges"],
  snippets: ["seed"],
};

if (!(target in seedScripts)) {
  console.error(
    `Unsupported prod seed target: ${target}. Use one of: ${Object.keys(seedScripts).join(", ")}.`,
  );
  process.exit(1);
}

// The API driver takes a plain YDB connection string; drop goose-only params.
const buildDbString = (baseDbString) => {
  const url = new URL(baseDbString);

  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("go_") || key === "token") {
      url.searchParams.delete(key);
    }
  }

  return url.toString();
};

const env = parseEnvFile(envPath);
const dbString = env.DB_CONNECTION_STRING || env.GOOSE_DBSTRING;

if (!dbString) {
  console.error(
    `DB_CONNECTION_STRING or GOOSE_DBSTRING is missing in ${envPath}.`,
  );
  process.exit(1);
}

const prodDbString = buildDbString(dbString);
const token = getIamToken();

// dotenv does not override variables that are already set, so these win over
// apps/api/.env while the remaining app config is still loaded from it.
const seedEnv = {
  ...process.env,
  DB_CONNECTION_STRING: prodDbString,
  NODE_ENV: "production",
  YDB_ACCESS_TOKEN_CREDENTIALS: token,
};

console.info(`Seeding prod database: ${prodDbString}`);

for (const script of seedScripts[target]) {
  const result = spawnSync("pnpm", ["--filter", "api", script], {
    env: seedEnv,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
