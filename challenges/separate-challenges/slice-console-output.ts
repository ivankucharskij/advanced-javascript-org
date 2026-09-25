export const sliceConsoleOutputChallenge = {
  slug: "slice-console-output",
  snippetId: "72dedbd0-fbeb-47be-8f5a-a54530799f66",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customSlice(1, -1));\r\nconsole.log(values);",
  order: 1,
  options: [
    {
      label: "[2,3], then [1,2,3,4]",
      feedback:
        "Correct. The snippet copies a normalized index range into a new array without mutating the source, so the output is `[2,3], then [1,2,3,4]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "[1,2,3], then [1,2,3,4]",
      feedback: "Not quite. The output is `[2,3], then [1,2,3,4]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[2,3], then [2,3]",
      feedback: "Not quite. The output is `[2,3], then [1,2,3,4]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
