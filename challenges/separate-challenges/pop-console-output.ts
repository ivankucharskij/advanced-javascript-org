export const popConsoleOutputChallenge = {
  slug: "pop-console-output",
  snippetId: "c4dce4b3-1435-4d35-9384-d722ceae0000",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1, 2];\r\nconsole.log(values.customPop());\r\nconsole.log(values);",
  order: 1,
  options: [
    {
      label: "1, then [2]",
      feedback: "Not quite. The output is `2, then [1]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "2, then [1,2]",
      feedback: "Not quite. The output is `2, then [1]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "2, then [1]",
      feedback:
        "Correct. The snippet removes the last array element by shortening length and returns the removed value, so the output is `2, then [1]`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
