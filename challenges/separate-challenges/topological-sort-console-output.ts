export const topologicalSortConsoleOutputChallenge = {
  slug: "topological-sort-console-output",
  snippetId: "f250e367-76e3-4978-aabf-7b9e482ebe0a",
  topicSlug: "random",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "1,2,3,4,5,6,7,8,9,10",
      feedback:
        "Not quite. Cards with dependencies wait until their dependent ids have already been added.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "3,6,7,8,1,2,4,5,9,10",
      feedback:
        "Correct. The snippet logs the full dependency order produced by the pass-based algorithm.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "6,7,8,3,2,5,1,4,9,10",
      feedback:
        "Not quite. The algorithm scans cards in their original order each pass, so card `3` is added before `6` in the first pass.",
      isCorrect: false,
      order: 3,
    },
  ],
};
