## 10. flat

slug: flat
topicSlug: array-methods
title: Implement Array.prototype.flat
description: Recursively flattens nested arrays up to a requested depth.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.flat
sourceSnippet: flat
language: js

```js
Array.prototype.customFlat = function (depth = 1) {
  const result = [];

  const flatten = (array, depth) => {
    for (const item of array) {
      if (Array.isArray(item) && depth > 0) {
        flatten(item, depth - 1);
      } else {
        result.push(item);
      }
    }
  };
  flatten(this, depth);

  return result;
};
```

### Challenge 1

slug: flat-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify([1, [2, [3]], 4].customFlat(1)));
```

Options:

1. `[1,2,[3],4]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,2,3,4]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[1,[2,[3]],4]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: flat-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(JSON.stringify([1, [2, [3]]].customFlat(2)));
```

Options:

1. `[1,2,3]`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `[1,2,[3]]`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `[1,[2,[3]]]`
   - correct: false
   - feedback: This does not match the value printed by console.log.
