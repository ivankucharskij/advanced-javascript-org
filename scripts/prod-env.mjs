import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const prodEnvPath = "apps/api/.env.production.local";

export const parseEnvFile = (path) => {
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

export const getIamToken = () => {
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
