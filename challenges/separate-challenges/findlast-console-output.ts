export const findlastConsoleOutputChallenge = {
  slug: "findlast-console-output",
  snippetId: "78600ee3-8e9b-44ae-b04f-1a0075f87738",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 4, 6].customFindLast((n) => n > 3));",
  order: 1,
  options: [
    {
      label: "4",
      feedback: "Not quite. The output is `6`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "undefined",
      feedback: "Not quite. The output is `6`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "6",
      feedback:
        "Correct. The snippet scans from the end to return the last item that satisfies a predicate callback, so the output is `6`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
