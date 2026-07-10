## 11. flatmap

slug: flatmap
topicSlug: array-methods
title: Implement Array.prototype.flatMap
description: Maps each item and flattens array results by one level.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.flatMap
sourceSnippet: flatMap
language: js

```js
Array.prototype.customFlatMap = function (callback, thisArg) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    const mapped = callback.call(thisArg, this[i], i, this);

    if (Array.isArray(mapped)) {
      result.push(...mapped); // Use spread operator for flattening
    } else {
      result.push(mapped);
    }
  }

  return result;
};
```

### Challenge 1

slug: flatmap-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 2, 3].customFlatMap((n) => [n, n * 2]));
```

Options:

1. `[1,2,2,4,3,6]`
   - correct: true
   - feedback: Correct. The snippet maps each item and flattens array results by one level, so the output is `[1,2,2,4,3,6]`.

2. `[[1,2],[2,4],[3,6]]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,2,4,3,6]`.

3. `[2,4,6]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,2,4,3,6]`.
