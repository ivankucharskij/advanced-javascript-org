"use client";

import type { ChallengeSessionMode } from "@repo/shared-types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { challengeApi } from "@/api/challenges";
import Header from "@/app/challenges/_entities/header";
import { Mode } from "@/app/challenges/_entities/mode";
import ChallengeFeature from "@/app/challenges/_features/challenge";
import { Dashboard } from "@/app/challenges/_features/dashboard";
import ElementStates from "@/app/challenges/_features/element-states";

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

  const challenge = nextChallengeResponse?.data.challenge ?? null;
  const dashboard = dashboardResponse?.data ?? null;

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

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        {mode === "review" ? (
          <Header title={"Review challenges"} homeLink={"/challenges"} />
        ) : (
          <Header title={"Practice challenges"} homeLink={"/challenges"} />
        )}

        <ElementStates
          isLoading={isLoading}
          error={error}
          authRequired={dashboard?.authRequired ?? false}
        >
          {challenge ? (
            <ChallengeFeature challenge={challenge} mode={mode} />
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
        </ElementStates>
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
          showAuthPrompt={showAuthPrompt}
        />
      ) : null}
    </main>
  );
}
