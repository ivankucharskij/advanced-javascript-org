export const reduceEdgeConsoleOutputChallenge = {
  slug: "reduce-edge-console-output",
  snippetId: "5fac89da-a848-44b0-bea1-ec462e98ac76",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "console.log([2, 3, 4].customReduce((product, n) => product * n));",
  order: 2,
  options: [
    {
      label: "24",
      feedback:
        "Correct. This follows the same implementation, so the output is `24`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "0",
      feedback: "Not quite. This edge case outputs `24`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "9",
      feedback: "Not quite. This edge case outputs `24`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
