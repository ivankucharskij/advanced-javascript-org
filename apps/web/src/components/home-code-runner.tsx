"use client";

import { javascript } from "@codemirror/lang-javascript";
import {
  loadSandpackClient,
  type SandboxSetup,
  type SandpackClient,
} from "@codesandbox/sandpack-client";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import {
  Children,
  isValidElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { twMerge } from "tailwind-merge";

const placeholderCode = `document.getElementById("output").textContent = "Click Run to execute the snippet.";`;

function toCssSize(
  value: number | string | undefined,
  fallback: string,
): string {
  if (typeof value === "number") return `${value}px`;
  return value ?? fallback;
}

function normalizeCode(code: string): string {
  return code.trim();
}

function extractCodeFromChildren(children: ReactNode): string | undefined {
  if (typeof children === "string") return children;

  const parts = Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractCodeFromChildren(child.props.children);
      }

      return "";
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : undefined;
}

function createSandbox(code: string): SandboxSetup {
  return {
    template: "static",
    entry: "/index.js",
    files: {
      "/package.json": {
        code: JSON.stringify({ main: "/index.js" }),
      },
      "/index.html": {
        code: `<div id="output"></div><script type="module" src="/index.js"></script>`,
      },
      "/index.js": {
        code: `
        const output = document.getElementById("output");
        const format = (value) => {
          if (typeof value === "string") return value;
          try {
            return JSON.stringify(value, null, 2);
          } catch {
            return String(value);
          }
        };
        
        console.log = (...args) => {
          output.textContent += args.map(format).join(" ") + "\\n";
        };
        
        window.addEventListener("error", (event) => {
          console.log(event.message);
        });

        ${code}`,
      },
    },
  };
}

function subscribeToThemeClassChange(callback: () => void) {
  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributeFilter: ["class"],
    attributes: true,
  });

  return () => {
    observer.disconnect();
  };
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

function useAppDarkTheme() {
  return useSyncExternalStore(
    subscribeToThemeClassChange,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
}

export function HomeCodeRunner({
  code: codeProp,
  children,
  inputHeight,
  outputHeight,
  className,
}: {
  code?: string;
  children?: ReactNode;
  inputHeight?: number | string;
  outputHeight?: number | string;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clientRef = useRef<SandpackClient | null>(null);
  const initialCode = useMemo(() => {
    const codeFromChildren = extractCodeFromChildren(children);
    return normalizeCode(codeProp ?? codeFromChildren ?? "");
  }, [children, codeProp]);
  const [code, setCode] = useState(initialCode);
  const isDarkTheme = useAppDarkTheme();
  const sandbox = useMemo(() => createSandbox(placeholderCode), []);
  const editorHeight = toCssSize(inputHeight, "160px");
  const runnerHeight = toCssSize(outputHeight, "96px");

  useEffect(() => {
    let cancelled = false;

    async function mountClient() {
      if (!iframeRef.current) return;

      const client = await loadSandpackClient(iframeRef.current, sandbox, {
        showLoadingScreen: true,
        showErrorScreen: true,
      });

      if (cancelled) {
        client.destroy();
        return;
      }

      clientRef.current = client;
    }

    mountClient().catch(console.error);

    return () => {
      cancelled = true;
      clientRef.current?.destroy();
      clientRef.current = null;
    };
  }, [sandbox]);

  function runCode() {
    clientRef.current?.updateSandbox(createSandbox(code));
  }

  return (
    <section
      className={twMerge(
        "col-span-full grid gap-4 rounded-lg border bg-fd-card p-2 md:p-4",
        className,
      )}
    >
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium">Try a snippet</h2>
          <button
            type="button"
            onClick={runCode}
            className="rounded-md brand-background text-white dark:text-black px-3 py-1.5 text-sm font-medium transition hover:opacity-85 hover:shadow-md cursor-pointer"
          >
            Run
          </button>
        </div>
        <CodeMirror
          value={code}
          height={editorHeight}
          basicSetup={{
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            lineNumbers: false,
          }}
          extensions={[javascript({ jsx: false, typescript: true })]}
          theme={isDarkTheme ? githubDark : githubLight}
          onChange={setCode}
          className="overflow-hidden rounded-md border bg-fd-background text-sm [&_.cm-editor]:font-mono [&_.cm-editor]:outline-none [&_.cm-focused]:outline-none"
        />
      </div>
      <iframe
        ref={iframeRef}
        title="JavaScript snippet output"
        style={{ height: runnerHeight }}
        className="w-full rounded-md border text-white"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      />
    </section>
  );
}
