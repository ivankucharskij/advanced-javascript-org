export const findlastConsoleOutputChallenge = {
  slug: "findlast-console-output",
  snippetId: "07051a5d-5d36-4481-b8e7-b542a2bac766",
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
