export const undirectedPathEdgeConsoleOutputChallenge = {
  slug: "undirected-path-edge-console-output",
  snippetId: "758b7400-6840-48ff-9e33-d59d799f3084",
  topicSlug: "graph-traversal",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: 'const edges = [["a", "b"], ["c", "d"]];\r\nconsole.log(undirectedPath(edges, "a", "d"));',
  order: 2,
  options: [
    {
      label: "true",
      feedback: "Not quite. `a` and `d` are in separate connected components.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "false",
      feedback:
        "Correct. This follows the same implementation, so the output is `false`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "RangeError",
      feedback:
        "Not quite. The visited set prevents infinite recursion on undirected edges.",
      isCorrect: false,
      order: 3,
    },
  ],
};
