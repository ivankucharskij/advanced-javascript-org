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
console.log(values.customFill(0, 1, 3));
```

Options:

1. `[1,0,0,4]`
   - correct: true
   - feedback: Correct. The snippet mutates an array by writing one value across a normalized start and end range, so the output is `[1,0,0,4]`.

2. `[0,0,0,4]`
   - correct: false
   - feedback: Not quite. The output is `[1,0,0,4]`.

3. `[1,0,3,4]`
   - correct: false
   - feedback: Not quite. The output is `[1,0,0,4]`.

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
   - feedback: Correct. This follows the same implementation, so the output is `[1,2,9,9]`.

2. `[9,9,3,4]`
   - correct: false
   - feedback: Not quite. This edge case outputs `[1,2,9,9]`.

3. `[1,2,3,4]`
   - correct: false
   - feedback: Not quite. This edge case outputs `[1,2,9,9]`.
