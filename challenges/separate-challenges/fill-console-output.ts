export const fillConsoleOutputChallenge = {
  slug: "fill-console-output",
  snippetId: "af4084a5-7dfc-4e7b-86c6-108d3ce7b682",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customFill(0, 1, 3));",
  order: 1,
  options: [
    {
      label: "[0,0,0,4]",
      feedback: "Not quite. The output is `[1,0,0,4]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[1,0,3,4]",
      feedback: "Not quite. The output is `[1,0,0,4]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[1,0,0,4]",
      feedback:
        "Correct. The snippet mutates an array by writing one value across a normalized start and end range, so the output is `[1,0,0,4]`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
