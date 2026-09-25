export const undirectedPathConsoleOutputChallenge = {
  slug: "undirected-path-console-output",
  snippetId: "758b7400-6840-48ff-9e33-d59d799f3084",
  topicSlug: "graph-traversal",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const edges = [["i", "j"], ["k", "i"], ["m", "k"]];\r\nconsole.log(undirectedPath(edges, "j", "m"));',
  order: 1,
  options: [
    {
      label: "false",
      feedback:
        "Not quite. The undirected edges connect `j -> i -> k -> m`, so a path exists.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "true, then false",
      feedback:
        "Not quite. This challenge performs only one call, and that call returns true.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "true",
      feedback:
        "Correct. The snippet builds an adjacency list and uses a visited set to search an undirected graph, so the output is `true`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
