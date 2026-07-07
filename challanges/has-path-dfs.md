## 56. has-path-dfs

slug: has-path-dfs
topicSlug: graph-traversal
title: Directed Graph Path Search with DFS
description: Searches a directed graph recursively to determine whether a destination is reachable.
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Has Path in Directed Graphs (DFS & BFS)
sourceSnippet: has path
language: ts

```ts
type Graph = Record<string, string[]>;

// Depth-First Search
const hasPath = (graph: Graph, src: string, dst: string): boolean => {
  if (src === dst) return true;

  for (const neighbor of graph[src]) {
    if (hasPath(graph, neighbor, dst)) {
      return true;
    }
  }

  return false;
};
```

### Challenge 1

slug: has-path-dfs-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const graph = { a: ["b", "c"], b: ["d"], c: [], d: [] };
console.log(hasPath(graph, "a", "d"));
```

Options:

1. `true`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `false`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `d`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: has-path-dfs-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
const graph = { a: ["b"], b: [], c: [] };
console.log(hasPath(graph, "a", "c"));
```

Options:

1. `false`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `true`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `c`
   - correct: false
   - feedback: This does not match the value printed by console.log.
