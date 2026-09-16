import type { Challenge, ChallengeSessionMode } from "@repo/shared-types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { challengeApi } from "@/api/challenges";
import { Answer } from "@/app/challenges/_entities/answer";
import { Option } from "@/app/challenges/_entities/option";
import { CodeRunner } from "@/components/code-runner";

function getCodeEditorHeight(code: string) {
  const lineCount = Math.max(code.split("\n").length, 3);

  return lineCount * 21 + 24;
}

export default function ChallengeFeature({
  mode,
  challenge,
}: {
  mode: ChallengeSessionMode;
  challenge: Challenge;
}) {
  const { mutate: mutateDashboard } = useSWR(
    "/api/challenges/dashboard",
    () => challengeApi.dashboard(),
    {
      shouldRetryOnError: false,
    },
  );
  const { data: nextChallengeResponse, mutate: mutateNextChallenge } = useSWR(
    ["/api/challenges/next", mode],
    () => challengeApi.next(mode),
    {
      shouldRetryOnError: false,
    },
  );
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

  const answer = answerMutation.data ?? null;

  const code = challenge?.code ?? "";
  const selectedOptionId = answer?.data.selectedOptionId ?? null;
  const correctOptionId = answer?.data.correctOptionId ?? null;

  const selectOption = (optionId: string) => {
    if (answer || answerMutation.isMutating || !challenge) return;

    void answerMutation.trigger({
      challengeId: challenge.id,
      optionId,
    });
  };

  const showNextChallenge = () => {
    answerMutation.reset();
    void mutateNextChallenge();
  };

  return (
    <>
      <section className="grid gap-2 rounded-md border bg-fd-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-fd-muted-foreground">
          <span>{challenge.title}</span>
          <span>
            {nextChallengeResponse?.data.answered ?? 0} answered ·{" "}
            {nextChallengeResponse?.data.total ?? 0} total
          </span>
        </div>
        <p className="text-lg font-medium leading-7">{challenge.prompt}</p>
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

      {answer ? <Answer answer={answer} onNext={showNextChallenge} /> : null}
    </>
  );
}
