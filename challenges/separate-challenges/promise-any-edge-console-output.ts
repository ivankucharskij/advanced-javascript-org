export const promiseAnyEdgeConsoleOutputChallenge = {
  slug: "promise-any-edge-console-output",
  snippetId: "e009feda-50da-4ec8-bcec-da293cb37c50",
  topicSlug: "promises",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: 'Promise.customAny([Promise.reject("a"), Promise.reject("b")]).catch((error) => console.log(error.message));',
  order: 2,
  options: [
    {
      label: "All promises were rejected",
      feedback:
        "Not quite. That message prints, but the reusable snippet later prints `quick` too.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "a",
      feedback:
        "Promise.any collects all rejection reasons instead of printing the first one directly.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "All promises were rejected, then quick",
      feedback:
        'Correct. The edge-case rejection is handled before the reusable snippet\'s delayed `"quick"` fulfillment prints.',
      isCorrect: true,
      order: 3,
    },
  ],
};
