## 14. reduce

slug: reduce
topicSlug: array-methods
title: Implement Array.prototype.reduce
description: Accumulates array values with an optional initial accumulator.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.reduce
sourceSnippet: reduce
language: js

```js
Array.prototype.customReduce = function (callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];

  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};
```

### Challenge 1

slug: reduce-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 2, 3].customReduce((sum, n) => sum + n, 10));
```

Options:

1. `16`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `6`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `10`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: reduce-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log([2, 3, 4].customReduce((product, n) => product * n));
```

Options:

1. `24`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `9`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `0`
   - correct: false
   - feedback: This does not match the value printed by console.log.
