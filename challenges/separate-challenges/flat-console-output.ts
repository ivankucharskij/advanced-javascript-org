export const flatConsoleOutputChallenge = {
  slug: "flat-console-output",
  snippetId: "250f5cb7-2a13-46cc-b3c0-0a8443c46be3",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, [2, [3]], 4].customFlat(1));",
  order: 1,
  options: [
    {
      label: "[1,2,[3],4]",
      feedback:
        "Correct. The snippet recursively flattens nested arrays up to a requested depth, so the output is `[1,2,[3],4]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "[1,2,3,4]",
      feedback: "Not quite. The output is `[1,2,[3],4]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[1,[2,[3]],4]",
      feedback: "Not quite. The output is `[1,2,[3],4]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
