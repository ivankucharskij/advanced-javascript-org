export const clsxEdgeConsoleOutputChallenge = {
  slug: "clsx-edge-console-output",
  snippetId: "f136f95d-bb51-4ef8-9b47-6f408f905d73",
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
