export const unionConsoleOutputChallenge = {
  slug: "union-console-output",
  snippetId: "662b2e17-804b-4083-8674-59363cb0dec1",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log(union([1, 2], [2, 3]));",
  order: 1,
  options: [
    {
      label: "[1,2,2,3]",
      feedback: "Not quite. The output is `[1,2,3]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[1,2,3]",
      feedback:
        "Correct. The snippet combines arrays and removes duplicates with Set, so the output is `[1,2,3]`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[2]",
      feedback: "Not quite. The output is `[1,2,3]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
