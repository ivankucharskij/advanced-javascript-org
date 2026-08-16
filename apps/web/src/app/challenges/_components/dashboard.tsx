import type { ChallengeDashboardResponse } from "@repo/shared-types";
import { LogIn, X } from "lucide-react";

import { Results } from "@/app/challenges/_components/results";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Dashboard({
  dashboard,
  onDismissAuthPrompt,
  onPracticeWrongAnswers,
  onSignIn,
  showAuthPrompt,
}: {
  dashboard: ChallengeDashboardResponse["data"];
  onDismissAuthPrompt: () => void;
  onPracticeWrongAnswers: () => void;
  onSignIn: () => void;
  showAuthPrompt: boolean;
}) {
  return (
    <aside className="grid content-start gap-4">
      {showAuthPrompt ? (
        <section className="grid gap-3 rounded-md border bg-fd-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <LogIn className="mt-0.5 size-5 text-brand" />
              <div>
                <h2 className="text-base font-medium">Save progress</h2>
                <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">
                  Continue with Google to keep your challenge progress.
                </p>
              </div>
            </div>
            <button
              aria-label="Dismiss sign in prompt"
              className={buttonVariants({
                size: "icon-xs",
                variant: "ghost",
              })}
              onClick={onDismissAuthPrompt}
              type="button"
            >
              <X />
            </button>
          </div>
          <button
            className={cn(buttonVariants({ variant: "primary" }), "gap-2 px-3")}
            onClick={onSignIn}
            type="button"
          >
            <LogIn className="size-4" />
            Continue with Google
          </button>
        </section>
      ) : null}
      <Results
        dashboard={dashboard}
        onPracticeWrongAnswers={onPracticeWrongAnswers}
      />
    </aside>
  );
}
