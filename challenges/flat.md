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
console.log([1, [2, [3]], 4].customFlat(1));
```

Options:

1. `[1,2,[3],4]`
   - correct: true
   - feedback: Correct. The snippet recursively flattens nested arrays up to a requested depth, so the output is `[1,2,[3],4]`.

2. `[1,2,3,4]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,[3],4]`.

3. `[1,[2,[3]],4]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,[3],4]`.

### Challenge 2

slug: flat-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log([1, [2, [3]]].customFlat(2));
```

Options:

1. `[1,2,3]`
   - correct: true
   - feedback: Correct. This follows the same implementation, so the output is `[1,2,3]`.

2. `[1,2,[3]]`
   - correct: false
   - feedback: Not quite. This edge case outputs `[1,2,3]`.

3. `[1,[2,[3]]]`
   - correct: false
   - feedback: Not quite. This edge case outputs `[1,2,3]`.
