import "dotenv/config";

import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  type CreateChallengeInput,
  createChallengeSchema,
} from "@repo/shared-types";

import { challengesService } from "../features/challenges/challenges.service.js";
import { checkDbHealth, closeDb } from "../lib/db.js";
import { HttpStatus } from "../shared/http.js";

type SeedChallengeModule = Record<string, unknown>;

type SeedResult = {
  created: number;
  failed: Array<{
    message: string;
    slug: string;
    status: number;
  }>;
  skipped: number;
  total: number;
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const separateChallengesDir = resolve(
  currentDir,
  "../../../../challenges/separate-challenges",
);

const getChallengeExport = (module: SeedChallengeModule) => {
  const values = Object.values(module).flatMap((value) => {
    if (typeof value === "object" && value !== null && !("slug" in value)) {
      return Object.values(value);
    }

    return [value];
  });

  return values.find(
    (value): value is Record<string, unknown> =>
      typeof value === "object" &&
      value !== null &&
      "slug" in value &&
      "options" in value,
  );
};

const loadSeedChallenges = async (): Promise<CreateChallengeInput[]> => {
  const fileNames = (await readdir(separateChallengesDir))
    .filter((fileName) => fileName.endsWith(".ts"))
    .sort((first, second) => first.localeCompare(second));
  const challenges: CreateChallengeInput[] = [];

  for (const fileName of fileNames) {
    const challengeModule = (await import(
      pathToFileURL(resolve(separateChallengesDir, fileName)).href
    )) as SeedChallengeModule;
    const challenge = getChallengeExport(challengeModule);

    if (!challenge) {
      throw new Error(`No challenge export found in ${fileName}`);
    }

    challenges.push(createChallengeSchema.parse(challenge));
  }

  return challenges;
};

const seedChallenges = async (
  challenges: CreateChallengeInput[],
): Promise<SeedResult> => {
  const result: SeedResult = {
    created: 0,
    failed: [],
    skipped: 0,
    total: challenges.length,
  };

  for (const challenge of challenges) {
    try {
      const createResult = await challengesService.create(challenge);

      if (createResult.ok) {
        result.created += 1;
        continue;
      }

      if (createResult.status === HttpStatus.CONFLICT) {
        result.skipped += 1;
        continue;
      }

      result.failed.push({
        message: createResult.message,
        slug: challenge.slug,
        status: createResult.status,
      });
    } catch (error) {
      result.failed.push({
        message: error instanceof Error ? error.message : String(error),
        slug: challenge.slug,
        status: 500,
      });
    }
  }

  return result;
};

const main = async () => {
  await checkDbHealth();

  const result = await seedChallenges(await loadSeedChallenges());

  console.info(
    [
      "Seeded challenges:",
      `${result.created} created,`,
      `${result.skipped} skipped,`,
      `${result.failed.length} failed,`,
      `${result.total} total.`,
    ].join(" "),
  );

  if (result.failed.length > 0) {
    throw new Error(
      result.failed
        .map(
          (failure) =>
            `${failure.slug}: ${failure.status} ${failure.message}`,
        )
        .join("\n"),
    );
  }

  console.info("Challenge seed completed.");
};

main()
  .catch((error) => {
    console.error("Challenge seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    closeDb();
  });
