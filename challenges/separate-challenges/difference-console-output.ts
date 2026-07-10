export const differenceConsoleOutputChallenge = {
  slug: "difference-console-output",
  snippetId: "63109132-883e-47b3-8d68-b66c85642269",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log(findDifference([1, 2, 3], [2, 4]));",
  order: 1,
  options: [
    {
      label: "[1,3]",
      feedback:
        "Not quite. That is only the left-side difference; this helper returns `[diffLeft, diffRight]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[[1,3],[]]",
      feedback:
        "Not quite. `4` is unique to the second array, so the right-side difference is not empty.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[[1,3],[4]]",
      feedback:
        "Correct. `findDifference` returns both sides: values only in the first array, then values only in the second array.",
      isCorrect: true,
      order: 3,
    },
  ],
};
