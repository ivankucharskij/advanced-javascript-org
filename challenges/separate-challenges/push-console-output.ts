export const pushConsoleOutputChallenge = {
  slug: "push-console-output",
  snippetId: "685e115c-ed27-40a2-85fe-194e102101a5",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1];\r\nconsole.log(values.customPush(2, 3));\r\nconsole.log(values);",
  order: 1,
  options: [
    {
      label: "2, then [1,2,3]",
      feedback: "Not quite. The output is `3, then [1,2,3]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "3, then [1,2,3]",
      feedback:
        "Correct. The snippet appends each argument to an array and returns the updated length, so the output is `3, then [1,2,3]`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[1,2,3], then 3",
      feedback: "Not quite. The output is `3, then [1,2,3]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
