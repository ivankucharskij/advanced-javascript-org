"use client";

import type { PracticeAnswerResponse } from "@repo/shared-types";
import { useState } from "react";

import { CodeRunner } from "@/components/code-runner";

import { Answer } from "./_components/answer";
import { Option } from "./_components/option";
import { Results } from "./_components/results";
import {
  mockPracticeAnswers,
  mockPracticeChallenges,
  mockPracticeDashboard,
} from "./mock-data";

function getCodeEditorHeight(code: string) {
  const lineCount = Math.max(code.split("\n").length, 3);

  return lineCount * 21 + 24;
}

export default function ChallengesPage() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState<PracticeAnswerResponse | null>(null);
  const challenge =
    mockPracticeChallenges[challengeIndex] ?? mockPracticeChallenges[0]!;
  const dashboard = mockPracticeDashboard.data;
  const selectedOptionId = answer?.data.selectedOptionId ?? null;
  const correctOptionId = answer?.data.correctOptionId ?? null;

  function selectOption(optionId: string) {
    if (answer) return;

    setAnswer(mockPracticeAnswers[optionId] ?? null);
  }

  function showNextChallenge() {
    setAnswer(null);
    setChallengeIndex((index) => (index + 1) % mockPracticeChallenges.length);
  }

  function practiceWrongAnswers() {
    setAnswer(null);
    setChallengeIndex(0);
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Challenges
          </h1>
        </header>

        <CodeRunner
          code={challenge.code}
          inputHeight={getCodeEditorHeight(challenge.code)}
          outputHeight={48}
          placeholderText="First pick the correct option. Then click run"
          title="Code"
        />

        <section className="grid gap-3">
          <h2 className="text-base font-medium">Result</h2>
          <div className="grid gap-2">
            {challenge.options.map((option) => (
              <Option
                key={option.id}
                disabled={answer !== null}
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
      </section>

      <Results
        dashboard={dashboard}
        onPracticeWrongAnswers={practiceWrongAnswers}
      />
    </main>
  );
}
