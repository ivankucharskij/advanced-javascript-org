export const reduceConsoleOutputChallenge = {
  slug: "reduce-console-output",
  snippetId: "5fac89da-a848-44b0-bea1-ec462e98ac76",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 2, 3].customReduce((sum, n) => sum + n, 10));",
  order: 1,
  options: [
    {
      label: "10",
      feedback: "Not quite. The output is `16`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "6",
      feedback: "Not quite. The output is `16`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "16",
      feedback:
        "Correct. The snippet accumulates array values with an optional initial accumulator, so the output is `16`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
