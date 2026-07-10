export const intersectionConsoleOutputChallenge = {
  slug: "intersection-console-output",
  snippetId: "f94bd2a2-bd9c-485d-928a-4fb745128ab1",
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
