export const methodChainingConsoleOutputChallenge = {
  slug: "method-chaining-console-output",
  snippetId: "e9fc77ef-da9f-431c-b0ed-2d158ba3569b",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "2, then 1",
      feedback: "Not quite. The output is `1, then 0`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "0, then -1",
      feedback: "Not quite. The output is `1, then 0`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "1, then 0",
      feedback:
        "Correct. The snippet returns this from object methods to support chained state updates, so the output is `1, then 0`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
