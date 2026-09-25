export const flatEdgeConsoleOutputChallenge = {
  slug: "flat-edge-console-output",
  snippetId: "50fb2d15-bac4-4115-81d1-b27d77a54875",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "console.log([1, [2, [3]]].customFlat(2));",
  order: 2,
  options: [
    {
      label: "[1,2,3]",
      feedback:
        "Correct. This follows the same implementation, so the output is `[1,2,3]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "[1,2,[3]]",
      feedback: "Not quite. This edge case outputs `[1,2,3]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[1,[2,[3]]]",
      feedback: "Not quite. This edge case outputs `[1,2,3]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
