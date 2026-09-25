export const concatConsoleOutputChallenge = {
  slug: "concat-console-output",
  snippetId: "b3eca3b4-90ef-4043-b3c8-d871f76487d1",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const numbers = [1, 2];\r\nconsole.log(numbers.myConcat([3, 4], 5));",
  order: 1,
  options: [
    {
      label: "[3,4,5]",
      feedback: "Not quite. The output is `[1,2,3,4,5]`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[1,2,3,4,5]",
      feedback:
        "Correct. The snippet combines the receiver with arrays or individual values and returns a new array, so the output is `[1,2,3,4,5]`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[1,2,[3,4],5]",
      feedback: "Not quite. The output is `[1,2,3,4,5]`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
