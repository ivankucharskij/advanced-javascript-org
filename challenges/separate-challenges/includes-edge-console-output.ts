export const includesEdgeConsoleOutputChallenge = {
  slug: "includes-edge-console-output",
  snippetId: "38479e07-cdaf-47ef-9c9b-a669331de990",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "console.log([1, 2, 3, 2].customIncludes(2, -2));",
  order: 2,
  options: [
    {
      label: "false",
      feedback: "Not quite. This edge case outputs `true`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "2",
      feedback: "Not quite. This edge case outputs `true`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "true",
      feedback:
        "Correct. This follows the same implementation, so the output is `true`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
