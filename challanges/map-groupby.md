## 69. map-groupby

slug: map-groupby
topicSlug: map-and-set
title: Implement Map.groupBy
description: Groups array items into a Map keyed by a callback result.
sourceFile: apps/web/content/map-and-set.mdx
sourceSection: Map.groupBy
sourceSnippet: Map.groupBy
language: js

```js
// Map.groupBy isn't available yet
function groupBy(array, callback) {
  const map = new Map();

  for (const item of array) {
    const key = callback(item);
    const group = map.get(key) || [];
    group.push(item);
    map.set(key, group);
  }

  return map;
}
```

### Challenge 1

slug: map-groupby-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const grouped = groupBy([1, 2, 3], (n) => (n % 2 ? "odd" : "even"));
console.log(grouped.get("odd").join(","));
```

Options:

1. `1,3`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `2`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `odd`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
