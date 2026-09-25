export const intersectionConsoleOutputChallenge = {
  slug: "intersection-console-output",
  snippetId: "964577f5-d961-41f1-b9e4-480555e455a4",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log(intersection([1, 2, 3], [2, 3, 4]));",
  order: 1,
  options: [
    {
      label: "[1,4]",
      feedback: "Not quite. The output is `[2,3]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[2,3]",
      feedback:
        "Correct. The snippet returns values present in both arrays using Set membership, so the output is `[2,3]`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[1,2,3,4]",
      feedback: "Not quite. The output is `[2,3]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
