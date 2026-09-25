export const topologicalSortEdgeConsoleOutputChallenge = {
  slug: "topological-sort-edge-console-output",
  snippetId: "148eb8b3-9106-462d-9e05-6d889c09580e",
  topicSlug: "random",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: 'console.log(getOrderedCards([{ id: 1, dependent: [] }, { id: 2, dependent: [1] }]).join(","));',
  order: 2,
  options: [
    {
      label: "3,6,7,8,1,2,4,5,9,10, then 1,2",
      feedback:
        "Correct. The reusable snippet logs the full `cards` order first, then the edge-case code logs `1,2`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "3,6,7,8,1,2,4,5,9,10, then 2,1",
      feedback:
        "Not quite. In the edge case, card `2` depends on `1`, so `1` must appear first.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "1,2 only",
      feedback:
        "Not quite. The reusable snippet logs its larger ordering before this edge-case call runs.",
      isCorrect: false,
      order: 3,
    },
  ],
};
