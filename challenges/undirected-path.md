## 58. undirected-path

slug: undirected-path
topicSlug: graph-traversal
title: Undirected Graph Path Search
description: Builds an adjacency list and uses a visited set to search an undirected graph.
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Path Existence in Undirected Graphs (DFS with Visited Set)
sourceSnippet: undirected path
language: ts

```ts
const undirectedPath = (
  edges: [string, string][],
  nodeA: string,
  nodeB: string,
): boolean => {
  const graph = buildGraph(edges);
  return hasPath(graph, nodeA, nodeB, new Set());
};

const buildGraph = (edges: [string, string][]) => {
  const graph: Record<string, string[]> = {};

  for (const [a, b] of edges) {
    if (!(a in graph)) graph[a] = [];
    if (!(b in graph)) graph[b] = [];
    graph[a].push(b);
    graph[b].push(a);
  }

  return graph;
};

const hasPath = (
  graph: Record<string, string[]>,
  src: string,
  dst: string,
  visited: Set<string>,
): boolean => {
  if (src === dst) return true;
  if (visited.has(src)) return false;
  visited.add(src);

  for (const neighbor of graph[src]) {
    if (hasPath(graph, neighbor, dst, visited)) {
      return true;
    }
  }

  return false;
};
```

### Challenge 1

slug: undirected-path-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const edges = [["i", "j"], ["k", "i"], ["m", "k"]];
console.log(undirectedPath(edges, "j", "m"));
```

Options:

1. `true`
   - correct: true
   - feedback: Correct. The snippet builds an adjacency list and uses a visited set to search an undirected graph, so the output is `true`.

2. `false`
   - correct: false
   - feedback: Not quite. The output is `true`.

3. `m`
   - correct: false
   - feedback: Not quite. The output is `true`.

### Challenge 2

slug: undirected-path-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
const edges = [["a", "b"], ["c", "d"]];
console.log(undirectedPath(edges, "a", "d"));
```

Options:

1. `false`
   - correct: true
   - feedback: Correct. This follows the same implementation, so the output is `false`.

2. `true`
   - correct: false
   - feedback: Not quite. This edge case outputs `false`.

3. `d`
   - correct: false
   - feedback: Not quite. This edge case outputs `false`.
