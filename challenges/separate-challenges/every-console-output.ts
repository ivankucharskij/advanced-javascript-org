export const everyConsoleOutputChallenge = {
  slug: "every-console-output",
  snippetId: "71f132e1-a157-42ff-84f0-8e246f478c38",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([2, 4, 6].customEvery((n) => n % 2 === 0));",
  order: 1,
  options: [
    {
      label: "false",
      feedback: "Not quite. Every value in `[2, 4, 6]` is even.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[true,true,true]",
      feedback:
        "Not quite. `every` returns one boolean, not the callback result for every item.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "true",
      feedback:
        "Correct. The snippet checks whether all array items satisfy a predicate callback, so the output is `true`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
