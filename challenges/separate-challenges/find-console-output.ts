export const findConsoleOutputChallenge = {
  slug: "find-console-output",
  snippetId: "33cba6c3-20e6-4da6-8366-9beefe3f5177",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 4, 6].customFind((n) => n > 3));",
  order: 1,
  options: [
    {
      label: "4",
      feedback:
        "Correct. The snippet returns the first item that satisfies a predicate callback, so the output is `4`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "6",
      feedback: "Not quite. The output is `4`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "undefined",
      feedback: "Not quite. The output is `4`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
