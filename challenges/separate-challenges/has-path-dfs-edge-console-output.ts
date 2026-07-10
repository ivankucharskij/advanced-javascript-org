export const hasPathDfsEdgeConsoleOutputChallenge = {
  slug: "has-path-dfs-edge-console-output",
  snippetId: "f7b47d7a-92f5-4512-9c81-b645f8f78538",
  topicSlug: "graph-traversal",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: 'const graph = { a: ["b"], b: [], c: [] };\r\nconsole.log(hasPath(graph, "a", "c"));',
  order: 2,
  options: [
    {
      label: "RangeError",
      feedback:
        "Not quite. There is no cycle in this input, so recursion terminates normally.",
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
      label: "true",
      feedback:
        "Not quite. `c` exists, but it is disconnected from `a` in this directed graph.",
      isCorrect: false,
      order: 3,
    },
  ],
};
