## 6. shift

slug: shift
topicSlug: array-methods
title: Implement Array.prototype.shift
description: Removes the first array element by shifting remaining values left.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.shift
sourceSnippet: shift
language: js

```js
Array.prototype.customShift = function () {
  if (!this.length) return;

  const firstElement = this[0];

  for (let i = 0; i < this.length; i++) {
    this[i] = this[i + 1];
  }

  this.length -= 1;

  return firstElement;
};
```

### Challenge 1

slug: shift-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2, 3];
console.log(values.customShift());
console.log(JSON.stringify(values));
```

Options:

1. `1, then [2,3]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `3, then [1,2]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `1, then [1,2,3]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
