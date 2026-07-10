export const flatmapConsoleOutputChallenge = {
  slug: "flatmap-console-output",
  snippetId: "0e52477a-ffda-4487-b4f5-a9ede575cf40",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 2, 3].customFlatMap((n) => [n, n * 2]));",
  order: 1,
  options: [
    {
      label: "[1,2,2,4,3,6]",
      feedback:
        "Correct. The snippet maps each item and flattens array results by one level, so the output is `[1,2,2,4,3,6]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "[[1,2],[2,4],[3,6]]",
      feedback: "Not quite. The output is `[1,2,2,4,3,6]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[2,4,6]",
      feedback: "Not quite. The output is `[1,2,2,4,3,6]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
