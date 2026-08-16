export const mapConsoleOutputChallenge = {
  slug: "map-console-output",
  snippetId: "c0d3cc56-0208-442f-a20b-b52a422cc6d7",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 2, 3].customMap((n) => n * 2));",
  order: 1,
  options: [
    {
      label: "[2,4,6]",
      feedback:
        "Correct. The snippet transforms every array item with a callback and returns the mapped values, so the output is `[2,4,6]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "[2,3,4]",
      feedback: "Not quite. The output is `[2,4,6]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[1,2,3]",
      feedback: "Not quite. The output is `[2,4,6]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
