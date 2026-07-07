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
console.log(JSON.stringify(values.customSlice(1, -1)));
console.log(JSON.stringify(values));
```

Options:

1. `[2,3], then [1,2,3,4]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[2,3], then [2,3]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[1,2,3], then [1,2,3,4]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
