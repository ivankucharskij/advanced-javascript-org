## 20. includes

slug: includes
topicSlug: array-methods
title: Implement Array.prototype.includes
description: Searches an array using SameValueZero equality, including NaN matching.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.includes
sourceSnippet: includes
language: js

```js
function sameValueZero(x, y) {
  return (
    x === y ||
    (typeof x === "number" && typeof y === "number" && x !== x && y !== y)
  );
}

Array.prototype.customIncludes = function (searchElement, fromIndex = 0) {
  const length = this.length;

  if (length === 0) {
    return false;
  }

  if (fromIndex < 0) {
    fromIndex = Math.max(length + fromIndex, 0);
  }

  for (let i = fromIndex; i < length; i++) {
    if (sameValueZero(this[i], searchElement)) {
      return true;
    }
  }

  return false;
};
```

### Challenge 1

slug: includes-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, NaN, 3].customIncludes(NaN));
```

Options:

1. `true`
   - correct: true
   - feedback: Correct. The snippet searches an array using SameValueZero equality, including NaN matching, so the output is `true`.

2. `false`
   - correct: false
   - feedback: Not quite. The output is `true`.

3. `NaN`
   - correct: false
   - feedback: Not quite. The output is `true`.

### Challenge 2

slug: includes-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log([1, 2, 3, 2].customIncludes(2, -2));
```

Options:

1. `true`
   - correct: true
   - feedback: Correct. This follows the same implementation, so the output is `true`.

2. `false`
   - correct: false
   - feedback: Not quite. This edge case outputs `true`.

3. `2`
   - correct: false
   - feedback: Not quite. This edge case outputs `true`.
