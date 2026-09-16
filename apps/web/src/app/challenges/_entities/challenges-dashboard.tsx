import { ChallengeDashboardResponse } from "@repo/shared-types";
import { ArrowRight, ListChecks, Target } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function ChallengesDashboard({
  dashboard,
}: {
  dashboard: ChallengeDashboardResponse["data"];
}) {
  return (
    <>
      <section className="grid gap-5 rounded-lg border bg-fd-card p-5 sm:p-6">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-brand">
            {dashboard.greetingName
              ? `Welcome back, ${dashboard.greetingName}`
              : "JavaScript practice"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Choose your next challenge
          </h2>
          <p className="max-w-2xl leading-7 text-fd-muted-foreground">
            Predict the output, run the code, and use review mode to revisit the
            answers that need another look.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className={cn(buttonVariants({ variant: "primary" }), "gap-2 px-4")}
            href="/challenges/practice"
          >
            Start practice
            <ArrowRight className="size-4" />
          </Link>
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 px-4",
            )}
            href="/challenges/review"
          >
            <Target className="size-4" />
            Review wrong answers
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          className="group grid gap-3 rounded-lg border bg-fd-card p-5 transition hover:bg-fd-accent"
          href="/challenges/practice"
        >
          <div className="flex items-center justify-between gap-3">
            <ListChecks className="size-5 text-brand" />
            <ArrowRight className="size-4 text-fd-muted-foreground transition group-hover:translate-x-0.5" />
          </div>
          <div>
            <p className="text-3xl font-semibold">{dashboard.practiceCount}</p>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              Challenges ready to practice
            </p>
          </div>
        </Link>
        <Link
          className="group grid gap-3 rounded-lg border bg-fd-card p-5 transition hover:bg-fd-accent"
          href="/challenges/review"
        >
          <div className="flex items-center justify-between gap-3">
            <Target className="size-5 text-brand" />
            <ArrowRight className="size-4 text-fd-muted-foreground transition group-hover:translate-x-0.5" />
          </div>
          <div>
            <p className="text-3xl font-semibold">{dashboard.reviewCount}</p>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              Wrong answers ready to review
            </p>
          </div>
        </Link>
      </section>
    </>
  );
}
