import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";

import { SnippetCodeRunner } from "@/components/snippet-code-runner";
import { baseOptions } from "@/lib/layout.shared";

const homeLinks = [
  {
    text: "Core Concepts",
    url: "/core-concepts",
    active: "nested-url" as const,
  },
  {
    text: "Event Loop",
    url: "/event-loop",
    active: "nested-url" as const,
  },
  {
    text: "Promises",
    url: "/promises",
    active: "nested-url" as const,
  },
  {
    text: "Data Structures",
    url: "/map-and-set",
    active: "nested-url" as const,
  },
];

export const metadata: Metadata = {
  title: "Advanced JavaScript",
  description:
    "Practice JavaScript with focused code snippets covering arrays, promises, the event loop, data structures, utility functions, and common interview edge cases.",
};

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions()} links={homeLinks}>
      <div className="grid items-start grid-cols-1 gap-4 md:gap-10 px-4 md:px-6 mx-auto w-full max-w-350 lg:grid-cols-2 mt-2 md:mt-4">
        <h1 className="text-4xl my-4 md:my-8 leading-tight font-medium xl:text-5xl col-span-full">
          Advanced JavaScript
          <br className="md:hidden" /> explained through
          <br />
          <span className="text-brand">code snippets</span>.
        </h1>
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Practice <span className="text-brand font-medium">JavaScript</span>{" "}
          with focused code snippets covering arrays, promises, the event loop,
          data structures, utility functions, and common interview edge cases.
          Read each snippet, predict the output, then check your reasoning
          against a concise explanation. The questions are based on the
          JavaScript topics that come up most often in interviews.
        </p>
        <SnippetCodeRunner
          snippetFile="event-loop.js"
          inputHeight={500}
          outputHeight={48}
        />
        <SnippetCodeRunner
          snippetFile="event-loop-microtasks.js"
          inputHeight={140}
          outputHeight={48}
        />
        <section className="col-span-full grid gap-6 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              What you can practice
            </h2>
            <p className="mt-3 text-base leading-7 text-fd-muted-foreground">
              Work through the parts of JavaScript that are essential but hard
              to understand: array methods, promise chains, microtasks, sorting
              callbacks, maps and sets, object references, recursion, and small
              utility functions. The examples are short enough to read
              carefully, but they still cover the behavior that every
              professional developer needs to understand to work effectively.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              Built for sharper interviews
            </h2>
            <p className="mt-3 text-base leading-7 text-fd-muted-foreground">
              This is for developers who already write JavaScript and want to
              dive deeper. It is useful before any interview: almost all
              companies ask questions about the event loop and &#39;this&#39;,
              so it&#39;s always better to be prepared if you&#39;re looking for
              a job.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              Why these topics matter
            </h2>
            <p className="mt-3 text-base leading-7 text-fd-muted-foreground">
              Most JavaScript mistakes come from small assumptions: when a
              callback runs, whether a value was copied or shared, how coercion
              changes a comparison, or how Promise.all works. Practice here,
              then use{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                target="_blank"
                rel="noreferrer"
              >
                MDN
              </a>{" "}
              and{" "}
              <a
                href="https://javascript.info/"
                target="_blank"
                rel="noreferrer"
              >
                JavaScript.info
              </a>{" "}
              as trusted references when you need deeper explanations.
            </p>
          </div>
        </section>
        <ul className="rounded-2xl text-sm p-6 bg-origin-border shadow-lg border bg-fd-card flex flex-col gap-6 col-span-full mb-8">
          <li>
            <span className="flex flex-row items-center gap-2 font-medium pb-1">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              Fully open-source.
            </span>
            <span className="mt-2 text-sm text-fd-muted-foreground">
              Open source and available on GitHub.
            </span>
          </li>
          <li className="flex flex-row flex-wrap gap-2 mt-auto">
            <Link
              className="inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight border border-transparent brand-background text-white dark:text-black shadow-sm transition hover:opacity-85 hover:shadow-md"
              href="/array-methods"
            >
              Start learning!
            </Link>
            <a
              href="https://github.com/ivankucharskij/advancedjavascript"
              rel="noreferrer noopener"
              className="inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent"
            >
              Open GitHub
            </a>
          </li>
        </ul>
      </div>
    </HomeLayout>
  );
}
