"use client";

import { ArrowRight, Home, ListChecks, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

import { challengeApi } from "@/api/challenges";
import { AuthRequired } from "@/app/challenges/_components/auth-required";
import { Dashboard } from "@/app/challenges/_components/dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function ChallengesPage() {
  const router = useRouter();
  const [isAuthPromptDismissed, setIsAuthPromptDismissed] = useState(false);
  const {
    data: dashboardResponse,
    error,
    isLoading,
  } = useSWR("/api/challenges/dashboard", () => challengeApi.dashboard(), {
    shouldRetryOnError: false,
  });
  const dashboard = dashboardResponse?.data ?? null;
  const isGuest = dashboard ? dashboard.greetingName === null : false;
  const showAuthPrompt =
    dashboard !== null &&
    isGuest &&
    !dashboard.authRequired &&
    !isAuthPromptDismissed;

  function startGoogleAuth() {
    window.location.assign("/api/auth/google");
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        <header>
          <h1 className="flex items-center justify-between gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Challenges
            <Link aria-label="Back to array methods" href="/array-methods">
              <Home />
            </Link>
          </h1>
        </header>

        {isLoading ? (
          <p className="text-fd-muted-foreground">Loading challenges...</p>
        ) : error instanceof Error ? (
          <pre className="whitespace-pre-wrap rounded-md border bg-fd-card p-4 text-sm text-red-600">
            {error.message}
          </pre>
        ) : dashboard?.authRequired ? (
          <AuthRequired onSignIn={startGoogleAuth} />
        ) : dashboard ? (
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
                  Predict the output, run the code, and use review mode to
                  revisit the answers that need another look.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    "gap-2 px-4",
                  )}
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
                  <p className="text-3xl font-semibold">
                    {dashboard.practiceCount}
                  </p>
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
                  <p className="text-3xl font-semibold">
                    {dashboard.reviewCount}
                  </p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">
                    Wrong answers ready to review
                  </p>
                </div>
              </Link>
            </section>
          </>
        ) : null}
      </section>

      {dashboard ? (
        <Dashboard
          dashboard={dashboard}
          onDismissAuthPrompt={() => {
            setIsAuthPromptDismissed(true);
          }}
          onPracticeWrongAnswers={() => {
            router.push("/challenges/review");
          }}
          onSignIn={startGoogleAuth}
          showAuthPrompt={showAuthPrompt}
        />
      ) : null}
    </main>
  );
}
