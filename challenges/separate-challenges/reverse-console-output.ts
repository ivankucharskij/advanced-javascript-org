export const reverseConsoleOutputChallenge = {
  slug: "reverse-console-output",
  snippetId: "19e39fb1-a125-4fe0-8521-db599634ac36",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const values = [1, 2, 3];\r\nconsole.log(values.customReverse());",
  order: 1,
  options: [
    {
      label: "[2,1,3]",
      feedback: "Not quite. The output is `[3,2,1]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[1,2,3]",
      feedback: "Not quite. The output is `[3,2,1]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[3,2,1]",
      feedback:
        "Correct. The snippet swaps elements from both ends of an array to reverse it in place, so the output is `[3,2,1]`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
