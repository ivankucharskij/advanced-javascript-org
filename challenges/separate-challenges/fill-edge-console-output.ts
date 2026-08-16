export const fillEdgeConsoleOutputChallenge = {
  slug: "fill-edge-console-output",
  snippetId: "4b64342a-29f4-469b-a8be-98ed2b9020cd",
  topicSlug: "array-methods",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "const values = [1, 2, 3, 4];\r\nconsole.log(JSON.stringify(values.customFill(9, -2)));",
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
