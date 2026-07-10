export const hasPathDfsConsoleOutputChallenge = {
  slug: "has-path-dfs-console-output",
  snippetId: "f7b47d7a-92f5-4512-9c81-b645f8f78538",
  topicSlug: "graph-traversal",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const graph = { a: ["b", "c"], b: ["d"], c: [], d: [] };\r\nconsole.log(hasPath(graph, "a", "d"));',
  order: 1,
  options: [
    {
      label: "true, then d",
      feedback:
        "Not quite. The function returns a boolean; it does not log the destination node separately.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "false",
      feedback: "Not quite. DFS can reach `d` by following `a -> b -> d`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "true",
      feedback:
        "Correct. The snippet searches a directed graph recursively to determine whether a destination is reachable, so the output is `true`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
