export const shiftConsoleOutputChallenge = {
  slug: "shift-console-output",
  snippetId: "5e39e7ad-3c52-4bd0-b0c6-07e25fcdfa95",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1, 2, 3];\r\nconsole.log(values.customShift());\r\nconsole.log(values);",
  order: 1,
  options: [
    {
      label: "1, then [1,2,3]",
      feedback: "Not quite. The output is `1, then [2,3]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "3, then [1,2]",
      feedback: "Not quite. The output is `1, then [2,3]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "1, then [2,3]",
      feedback:
        "Correct. The snippet removes the first array element by shifting remaining values left, so the output is `1, then [2,3]`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
