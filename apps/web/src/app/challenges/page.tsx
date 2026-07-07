"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { challengeApi } from "@/api/challenges";
import { CodeRunner } from "@/components/code-runner";

import { Answer } from "./_components/answer";
import { Option } from "./_components/option";
import { Results } from "./_components/results";

function getCodeEditorHeight(code: string) {
  const lineCount = Math.max(code.split("\n").length, 3);

  return lineCount * 21 + 24;
}

export default function ChallengesPage() {
  const [mode, setMode] = useState<"practice" | "review">("practice");
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
        setMode("practice");
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

  function practiceWrongAnswers() {
    answerMutation.reset();
    setMode("review");
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl flex items-center gap-2 justify-between">
            Challenges
            <Link href={"/array-methods"}>
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
        ) : challenge ? (
          <>
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
          <section className="grid gap-3 rounded-md border bg-fd-card p-4">
            <h2 className="text-base font-medium">
              {mode === "review" ? "No wrong answers" : "No challenges found"}
            </h2>
            {mode === "practice" ? (
              <button
                className="w-fit rounded-md border px-3 py-2 text-sm"
                disabled={restartMutation.isMutating}
                onClick={() => {
                  void restartMutation.trigger();
                }}
                type="button"
              >
                {restartMutation.isMutating ? "Starting..." : "Start again"}
              </button>
            ) : (
              <button
                className="w-fit rounded-md border px-3 py-2 text-sm"
                onClick={() => {
                  setMode("practice");
                }}
                type="button"
              >
                Back to practice
              </button>
            )}
          </section>
        )}
      </section>

      {dashboard ? (
        <Results
          dashboard={dashboard}
          onPracticeWrongAnswers={practiceWrongAnswers}
        />
      ) : null}
    </main>
  );
}
