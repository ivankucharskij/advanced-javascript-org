import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { generate } from "orval";

const specUrl = process.env.OPENAPI_URL ?? "http://127.0.0.1:8080/doc";
const specPath = resolve("openapi.json");
const configPath = resolve("orval.config.ts");
const generatedIndexPath = resolve("src", "generated", "index.ts");
const tempTargetPath = resolve("src", "generated", "_orval.ts");

const main = async () => {
  const response = await fetch(specUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch OpenAPI document from ${specUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const specText = await response.text();

  await mkdir(dirname(specPath), { recursive: true });
  await writeFile(specPath, specText, "utf8");

  await generate(configPath);
  await rm(tempTargetPath, { force: true });
  await writeFile(
    generatedIndexPath,
    'export * from "./models";\nexport * from "./operations";\n',
    "utf8",
  );

  console.log(`Generated Orval client from ${specUrl}`);
  console.log(`Spec snapshot: ${specPath}`);
  console.log(`Client output: ${resolve("src", "generated")}`);
};

main().catch((error) => {
  console.error(
    `Unable to generate Orval client. Make sure the API is running and ${specUrl} is reachable.`,
  );
  console.error(error);
  process.exitCode = 1;
});
