export const clsxEdgeConsoleOutputChallenge = {
  slug: "clsx-edge-console-output",
  snippetId: "74b709ba-99e9-4583-94c5-7bcd0afb863c",
  topicSlug: "random",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: 'console.log(clsx(["a", ["b", { c: true, d: false }]], null, "e"));',
  order: 2,
  options: [
    {
      label: "a b c e",
      feedback:
        "Correct. This follows the same implementation, so the output is `a b c e`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "a,b,c,e",
      feedback: "Not quite. This edge case outputs `a b c e`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "a b c d e",
      feedback: "Not quite. This edge case outputs `a b c e`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
