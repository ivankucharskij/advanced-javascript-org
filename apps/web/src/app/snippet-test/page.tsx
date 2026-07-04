import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snippet Test",
};

const snippet = {
  slug: "concat",
  topicSlug: "array-methods",
  title: "Array.concat",
  language: "js",
  code: "Array.prototype.myConcat = function (...arrays) {\n  const result = [...this];\n\n  for (const array of arrays) {\n    if (Array.isArray(array)) {\n      result.push(...array);\n    } else {\n      result.push(array);\n    }\n  }\n\n  return result;\n};\n\nconst arr = [1, 2, 3];\nconst arr2 = [4, 5, 6, [1]];\nconst arr3 = [7, 8, 9];\nconst concat = arr.myConcat(arr2, arr3, 10);\nconsole.log(concat);\n",
};

export default function SnippetTestPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8">
      <header className="grid gap-2">
        <p className="text-sm font-medium text-fd-muted-foreground">
          {snippet.topicSlug} / {snippet.slug}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {snippet.title}
        </h1>
      </header>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Question</h2>
        <p className="text-xl leading-8">
          Read the full snippet. What does the final <code>console.log</code>{" "}
          print, and why is the nested <code>[1]</code> not flattened?
        </p>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Snippet</h2>
          <span className="rounded border px-2 py-1 text-xs uppercase tracking-wide text-fd-muted-foreground">
            {snippet.language}
          </span>
        </div>
        <DynamicCodeBlock lang={snippet.language} code={snippet.code} />
      </section>
    </main>
  );
}
