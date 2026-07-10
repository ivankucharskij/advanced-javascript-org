export const curryConsoleOutputChallenge = {
  slug: "curry-console-output",
  snippetId: "b310ec38-e517-4c52-acd5-f91f1b9196fa",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "const add = (a, b, c) => a + b + c;\r\nconsole.log(curry(add)(1)(2)(3));",
  order: 1,
  options: [
    {
      label: "123",
      feedback: "Not quite. The output is `6`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "3",
      feedback: "Not quite. The output is `6`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "6",
      feedback:
        "Correct. The snippet transforms a fixed-arity function into a chain of partially applied calls, so the output is `6`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
