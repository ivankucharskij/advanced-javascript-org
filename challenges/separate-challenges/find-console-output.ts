export const findConsoleOutputChallenge = {
  slug: "find-console-output",
  snippetId: "57b973f9-7eea-48a0-ad8c-5342a353756d",
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
