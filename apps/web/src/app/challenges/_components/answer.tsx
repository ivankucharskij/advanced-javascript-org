import type { ChallengeAnswerResponse } from "@repo/shared-types";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function Answer({
  answer,
  onNext,
}: {
  answer: ChallengeAnswerResponse;
  onNext: () => void;
}) {
  return (
    <section className="grid gap-3 rounded-md border bg-fd-card p-4">
      <div className="flex items-center gap-2">
        {answer.data.isCorrect ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : (
          <XCircle className="size-5 text-red-600" />
        )}
        <h2 className="text-base font-medium">
          {answer.data.isCorrect ? "Correct" : "Needs review"}
        </h2>
      </div>
      <p className="leading-7 text-fd-muted-foreground">
        {answer.data.feedback}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className={buttonVariants({ variant: "primary" })}
          onClick={onNext}
          type="button"
        >
          <ArrowRight className="size-4" />
          Next
        </button>
      </div>
    </section>
  );
}
