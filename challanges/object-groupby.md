## 68. object-groupby

slug: object-groupby
topicSlug: map-and-set
title: Implement Object.groupBy
description: Groups array items into an object keyed by a callback result.
sourceFile: apps/web/content/map-and-set.mdx
sourceSection: Object.groupBy
sourceSnippet: Object.groupBy
language: js

```js
const groupBy = (arr, callback) => {
  return arr.reduce((acc = {}, item) => {
    const key = callback(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});
};
```

### Challenge 1

slug: object-groupby-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const grouped = groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"));
console.log(JSON.stringify(grouped));
```

Options:

1. `{"odd":[1,3],"even":[2,4]}`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `{"even":[1,3],"odd":[2,4]}`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[[1,3],[2,4]]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
