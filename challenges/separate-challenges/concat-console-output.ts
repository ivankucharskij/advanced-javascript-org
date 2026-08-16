export const concatConsoleOutputChallenge = {
  slug: "concat-console-output",
  snippetId: "79c7a54c-bcbe-431f-83bc-7999872c3ca2",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const numbers = [1, 2];\r\nconsole.log(JSON.stringify(numbers.myConcat([3, 4], 5)));",
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
