import type { PracticeDashboardResponse } from "@repo/shared-types";
import { ListChecks, Target } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function Results({
  dashboard,
  onPracticeWrongAnswers,
}: {
  dashboard: PracticeDashboardResponse["data"];
  onPracticeWrongAnswers: () => void;
}) {
  return (
    <aside className="grid content-start gap-4">
      <section className="grid gap-3 rounded-md border bg-fd-card p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="size-5 text-brand" />
          <h2 className="text-base font-medium">Session</h2>
        </div>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-fd-muted-foreground">Total answered</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {dashboard.totalAnswered}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-fd-muted-foreground">Right</dt>
              <dd className="mt-1 text-2xl font-semibold text-green-600">
                {dashboard.totalCorrect}
              </dd>
            </div>
            <div>
              <dt className="text-fd-muted-foreground">Wrong</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600">
                {dashboard.totalWrong}
              </dd>
            </div>
          </div>
        </dl>
        <button
          className={buttonVariants({ variant: "secondary" })}
          disabled={dashboard.totalWrong === 0}
          onClick={onPracticeWrongAnswers}
          type="button"
        >
          <Target className="size-4" />
          Practice wrong answers
        </button>
      </section>
    </aside>
  );
}
