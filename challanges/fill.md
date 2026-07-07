## 2. fill

slug: fill
topicSlug: array-methods
title: Implement Array.prototype.fill
description: Mutates an array by writing one value across a normalized start and end range.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.fill
sourceSnippet: fill
language: js

```js
Array.prototype.customFill = function (value, start = 0, end = this.length) {
  if (start < 0) {
    start = this.length + start;
  }

  if (end < 0) {
    end = this.length + end;
  }

  for (let i = start; i < Math.min(end, this.length); i++) {
    this[i] = value;
  }

  return this;
};
```

### Challenge 1

slug: fill-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2, 3, 4];
console.log(JSON.stringify(values.customFill(0, 1, 3)));
```

Options:

1. `[1,0,0,4]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[0,0,0,4]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[1,0,3,4]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: fill-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
const values = [1, 2, 3, 4];
console.log(JSON.stringify(values.customFill(9, -2)));
```

Options:

1. `[1,2,9,9]`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `[9,9,3,4]`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `[1,2,3,4]`
   - correct: false
   - feedback: This does not match the value printed by console.log.
