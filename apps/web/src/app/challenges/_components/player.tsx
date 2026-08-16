"use client";

import type { ChallengeSessionMode } from "@repo/shared-types";
import { Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { challengeApi } from "@/api/challenges";
import { CodeRunner } from "@/components/code-runner";

import { Answer } from "./answer";
import { AuthRequired } from "./auth-required";
import { Dashboard } from "./dashboard";
import { Mode } from "./mode";
import { Option } from "./option";

function getCodeEditorHeight(code: string) {
  const lineCount = Math.max(code.split("\n").length, 3);

  return lineCount * 21 + 24;
}

export function ChallengePlayer({ mode }: { mode: ChallengeSessionMode }) {
  const router = useRouter();
  const [isAuthPromptDismissed, setIsAuthPromptDismissed] = useState(false);
  const {
    data: dashboardResponse,
    error: dashboardError,
    isLoading: isDashboardLoading,
    mutate: mutateDashboard,
  } = useSWR("/api/challenges/dashboard", () => challengeApi.dashboard(), {
    shouldRetryOnError: false,
  });
  const {
    data: nextChallengeResponse,
    error: nextChallengeError,
    isLoading: isNextChallengeLoading,
    mutate: mutateNextChallenge,
  } = useSWR(["/api/challenges/next", mode], () => challengeApi.next(mode), {
    shouldRetryOnError: false,
  });
  const answerMutation = useSWRMutation(
    "/api/challenges/answer",
    (
      _key: string,
      {
        arg,
      }: {
        arg: {
          challengeId: string;
          optionId: string;
        };
      },
    ) => challengeApi.answer(arg.challengeId, { optionId: arg.optionId }),
    {
      onSuccess: () => {
        void mutateDashboard();
      },
    },
  );
  const restartMutation = useSWRMutation(
    "/api/challenges/restart",
    () => challengeApi.restart(),
    {
      onSuccess: () => {
        answerMutation.reset();
        void mutateDashboard();
        void mutateNextChallenge();
      },
    },
  );
  const answer = answerMutation.data ?? null;
  const challenge = nextChallengeResponse?.data.challenge ?? null;
  const dashboard = dashboardResponse?.data ?? null;
  const code = challenge?.code ?? "";
  const selectedOptionId = answer?.data.selectedOptionId ?? null;
  const correctOptionId = answer?.data.correctOptionId ?? null;
  const isLoading = isDashboardLoading || isNextChallengeLoading;
  const error =
    dashboardError ??
    nextChallengeError ??
    answerMutation.error ??
    restartMutation.error;
  const isGuest = dashboard ? dashboard.greetingName === null : false;
  const showAuthPrompt =
    dashboard !== null &&
    isGuest &&
    !dashboard.authRequired &&
    !isAuthPromptDismissed;

  function startGoogleAuth() {
    window.location.assign("/api/auth/google");
  }

  function selectOption(optionId: string) {
    if (answer || answerMutation.isMutating || !challenge) return;

    void answerMutation.trigger({
      challengeId: challenge.id,
      optionId,
    });
  }

  function showNextChallenge() {
    answerMutation.reset();
    void mutateNextChallenge();
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        <header>
          <h1 className="flex items-center justify-between gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {mode === "review" ? "Review challenges" : "Practice challenges"}
            <Link aria-label="Back to challenges" href="/challenges">
              <Home />
            </Link>
          </h1>
        </header>

        {isLoading ? (
          <p className="text-fd-muted-foreground">Loading challenge...</p>
        ) : error instanceof Error ? (
          <pre className="whitespace-pre-wrap rounded-md border bg-fd-card p-4 text-sm text-red-600">
            {error.message}
          </pre>
        ) : dashboard?.authRequired ? (
          <AuthRequired onSignIn={startGoogleAuth} />
        ) : challenge ? (
          <>
            <section className="grid gap-2 rounded-md border bg-fd-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-fd-muted-foreground">
                <span>{challenge.title}</span>
                <span>
                  {nextChallengeResponse?.data.answered ?? 0} answered ·{" "}
                  {nextChallengeResponse?.data.total ?? 0} total
                </span>
              </div>
              <p className="text-lg font-medium leading-7">
                {challenge.prompt}
              </p>
            </section>

            <CodeRunner
              code={code}
              inputHeight={getCodeEditorHeight(code)}
              outputHeight={48}
              placeholderText="Click run"
              title="Code"
            />

            <section className="grid gap-3">
              <h2 className="text-base font-medium">Result</h2>
              <div className="grid gap-2">
                {challenge.options.map((option) => (
                  <Option
                    key={option.id}
                    disabled={answer !== null || answerMutation.isMutating}
                    isCorrect={correctOptionId === option.id}
                    isSelected={selectedOptionId === option.id}
                    label={option.label}
                    onSelect={() => {
                      selectOption(option.id);
                    }}
                  />
                ))}
              </div>
            </section>

            {answer ? (
              <Answer answer={answer} onNext={showNextChallenge} />
            ) : null}
          </>
        ) : (
          <Mode
            isRestarting={restartMutation.isMutating}
            mode={mode}
            onRestart={() => {
              void restartMutation.trigger();
            }}
            onShowPractice={() => {
              answerMutation.reset();
              router.push("/challenges/practice");
            }}
          />
        )}
      </section>

      {dashboard ? (
        <Dashboard
          dashboard={dashboard}
          onDismissAuthPrompt={() => {
            setIsAuthPromptDismissed(true);
          }}
          onPracticeWrongAnswers={() => {
            answerMutation.reset();
            router.push("/challenges/review");
          }}
          onSignIn={startGoogleAuth}
          showAuthPrompt={showAuthPrompt}
        />
      ) : null}
    </main>
  );
}
