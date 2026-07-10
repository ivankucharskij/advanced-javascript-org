export const spliceEdgeConsoleOutputChallenge = {
  slug: "splice-edge-console-output",
  snippetId: "59b5106c-44a9-4c99-a2e4-d9804ee3374e",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customSplice(-2));\r\nconsole.log(values);",
  order: 2,
  options: [
    {
      label: "[3,4], then [1,2,3,4]",
      feedback: "Not quite. This edge case outputs `[3,4], then [1,2]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[3,4], then [1,2]",
      feedback:
        "Correct. This follows the same implementation, so the output is `[3,4], then [1,2]`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[1,2], then [3,4]",
      feedback: "Not quite. This edge case outputs `[3,4], then [1,2]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
