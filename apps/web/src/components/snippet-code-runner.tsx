import { readFile } from "node:fs/promises";
import path from "node:path";

import { CodeRunner } from "@/components/code-runner";

const snippetsRoot = path.join(process.cwd(), "src", "snippets");

function resolveSnippetPath(snippetFile: string): string {
  const normalized = snippetFile.replaceAll("\\", "/").replace(/^\/+/, "");
  const resolved = path.resolve(snippetsRoot, normalized);

  if (!resolved.startsWith(snippetsRoot)) {
    throw new Error(`Snippet file must be inside src/snippets: ${snippetFile}`);
  }

  return resolved;
}

export async function SnippetCodeRunner({
  snippetFile,
  inputHeight,
  outputHeight,
  className,
}: {
  snippetFile: string;
  inputHeight?: number | string;
  outputHeight?: number | string;
  className?: string;
}) {
  const code = await readFile(resolveSnippetPath(snippetFile), "utf8");

  return (
    <CodeRunner
      code={code}
      inputHeight={inputHeight}
      outputHeight={outputHeight}
      className={className}
      title="Try a snippet"
    />
  );
}
