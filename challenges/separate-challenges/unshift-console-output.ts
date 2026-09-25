export const unshiftConsoleOutputChallenge = {
  slug: "unshift-console-output",
  snippetId: "3cc59e0a-c355-4b6d-8721-e3a20f2bd4c9",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [3, 4];\r\nconsole.log(values.customUnshift(1, 2));\r\nconsole.log(values);",
  order: 1,
  options: [
    {
      label: "4, then [1,2,3,4]",
      feedback:
        "Correct. The snippet prepends values by shifting existing elements right and returns the new length, so the output is `4, then [1,2,3,4]`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "2, then [1,2,3,4]",
      feedback: "Not quite. The output is `4, then [1,2,3,4]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "4, then [3,4,1,2]",
      feedback: "Not quite. The output is `4, then [1,2,3,4]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
