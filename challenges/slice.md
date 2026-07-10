## 15. slice

slug: slice
topicSlug: array-methods
title: Implement Array.prototype.slice
description: Copies a normalized index range into a new array without mutating the source.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.slice
sourceSnippet: slice
language: js

```js
Array.prototype.customSlice = function (start = 0, end) {
  const length = this.length;
  let endIndex = end || length;

  if (start < 0) {
    start = Math.max(length + start, 0);
  }
  if (endIndex < 0) {
    endIndex = Math.max(length + endIndex, 0);
  }

  const result = [];

  for (let i = start; i < endIndex && i < length; i++) {
    result.push(this[i]);
  }

  return result;
};
```

### Challenge 1

slug: slice-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2, 3, 4];
console.log(values.customSlice(1, -1));
console.log(values);
```

Options:

1. `[2,3], then [1,2,3,4]`
   - correct: true
   - feedback: Correct. The snippet copies a normalized index range into a new array without mutating the source, so the output is `[2,3], then [1,2,3,4]`.

2. `[2,3], then [2,3]`
   - correct: false
   - feedback: Not quite. The output is `[2,3], then [1,2,3,4]`.

3. `[1,2,3], then [1,2,3,4]`
   - correct: false
   - feedback: Not quite. The output is `[2,3], then [1,2,3,4]`.
