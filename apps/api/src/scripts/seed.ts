import "dotenv/config";

import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  type CreateChallengeSnippetInput,
  createChallengeSnippetSchema,
} from "@repo/shared-types";

import { challengeSnippetsService } from "../features/challenge-snippets/challenge-snippets.service.js";
import { checkDbHealth, closeDb } from "../lib/db.js";

type SeedSnippetsModule = {
  seedSnippets?: unknown;
};

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
const seedSnippetsPath = resolve(
  currentDir,
  "../../../../challenges/seed-snippets.ts",
);

const loadSeedSnippets = async (): Promise<CreateChallengeSnippetInput[]> => {
  const seedModule = (await import(
    pathToFileURL(seedSnippetsPath).href
  )) as SeedSnippetsModule;

  return createChallengeSnippetSchema.array().parse(seedModule.seedSnippets);
};

const seedChallengeSnippets = async (
  snippets: CreateChallengeSnippetInput[],
): Promise<SeedResult> => {
  const result: SeedResult = {
    created: 0,
    failed: [],
    skipped: 0,
    total: snippets.length,
  };

  for (const snippet of snippets) {
    try {
      const createResult = await challengeSnippetsService.create(snippet);

      if (createResult.ok) {
        result.created += 1;
        continue;
      }

      result.skipped += 1;
    } catch (error) {
      result.failed.push({
        message: error instanceof Error ? error.message : String(error),
        slug: snippet.slug,
        status: 500,
      });
    }
  }

  return result;
};

const main = async () => {
  await checkDbHealth();

  const snippetResult = await seedChallengeSnippets(await loadSeedSnippets());

  console.info(
    [
      "Seeded challenge snippets:",
      `${snippetResult.created} created,`,
      `${snippetResult.skipped} skipped,`,
      `${snippetResult.failed.length} failed,`,
      `${snippetResult.total} total.`,
    ].join(" "),
  );

  if (snippetResult.failed.length > 0) {
    throw new Error(
      snippetResult.failed
        .map(
          (failure) =>
            `${failure.slug}: ${failure.status} ${failure.message}`,
        )
        .join("\n"),
    );
  }

  console.info("Seed completed. No auth users are seeded for Google-only auth.");
};

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    closeDb();
  });
