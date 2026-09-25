export const fillEdgeConsoleOutputChallenge = {
  slug: "fill-edge-console-output",
  snippetId: "84e577ec-2808-4ca6-b436-f115ef1a8596",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customFill(9, -2));",
  order: 2,
  options: [
    {
      label: "[9,9,3,4]",
      feedback: "Not quite. This edge case outputs `[1,2,9,9]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[1,2,3,4]",
      feedback: "Not quite. This edge case outputs `[1,2,9,9]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[1,2,9,9]",
      feedback:
        "Correct. This follows the same implementation, so the output is `[1,2,9,9]`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
