export const includesConsoleOutputChallenge = {
  slug: "includes-console-output",
  snippetId: "026c913e-864a-40b3-b750-ce3fbb2f3d02",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, NaN, 3].customIncludes(NaN));",
  order: 1,
  options: [
    {
      label: "false",
      feedback: "Not quite. The output is `true`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "true",
      feedback:
        "Correct. The snippet searches an array using SameValueZero equality, including NaN matching, so the output is `true`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "NaN",
      feedback: "Not quite. The output is `true`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
