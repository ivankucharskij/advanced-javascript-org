## 57. has-path-bfs

slug: has-path-bfs
topicSlug: graph-traversal
title: Directed Graph Path Search with BFS
description: Searches a directed graph with a queue to determine whether a destination is reachable.
sourceFile: apps/web/content/graph-traversal.mdx
sourceSection: Has Path in Directed Graphs (DFS & BFS)
sourceSnippet: has path
language: ts

```ts
type Graph = Record<string, string[]>;

const hasPath = (
  graph: Graph,
  src: string,
  dst: string,
): boolean => {
  const queue: string[] = [src];

  while (queue.length) {
    const current = queue.shift();
    if (current === dst) return true;

    if (current && graph[current]) {
      for (const neighbor of graph[current]) {
        queue.push(neighbor);
      }
    }
  }

  return false;
};
```

### Challenge 1

slug: has-path-bfs-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const graph = { a: ["b"], b: ["c"], c: [] };
console.log(hasPath(graph, "c", "a"));
```

Options:

1. `false`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `true`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `a`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
