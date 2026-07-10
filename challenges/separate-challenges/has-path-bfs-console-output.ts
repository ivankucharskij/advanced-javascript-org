export const hasPathBfsConsoleOutputChallenge = {
  slug: "has-path-bfs-console-output",
  snippetId: "0b0589f7-7c80-430e-9079-baadd189a967",
  topicSlug: "graph-traversal",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const graph = { a: ["b"], b: ["c"], c: [] };\r\nconsole.log(hasPath(graph, "c", "a"));',
  order: 1,
  options: [
    {
      label: "TypeError",
      feedback:
        "Not quite. `graph.c` exists as an empty array, so the loop ends normally and returns false.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "false",
      feedback:
        "Correct. The snippet searches a directed graph with a queue to determine whether a destination is reachable, so the output is `false`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "true",
      feedback:
        "Not quite. BFS starts at `c`; there is no outgoing path from `c` back to `a` in this directed graph.",
      isCorrect: false,
      order: 3,
    },
  ],
};
