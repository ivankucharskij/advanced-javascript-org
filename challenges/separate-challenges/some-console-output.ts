export const someConsoleOutputChallenge = {
  slug: "some-console-output",
  snippetId: "9797e6bf-4c33-4c61-b342-e375dd5f944f",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 3, 4].customSome((n) => n % 2 === 0));",
  order: 1,
  options: [
    {
      label: "[false,false,true]",
      feedback:
        "Not quite. `some` returns one boolean, not the callback result for every item.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "true",
      feedback:
        "Correct. The snippet checks whether at least one array item satisfies a predicate callback, so the output is `true`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "false",
      feedback:
        "Not quite. The callback returns true for `4`, so `customSome` stops with true.",
      isCorrect: false,
      order: 3,
    },
  ],
};
