## 5. reverse

slug: reverse
topicSlug: array-methods
title: Implement Array.prototype.reverse
description: Swaps elements from both ends of an array to reverse it in place.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.reverse
sourceSnippet: reverse
language: js

```js
Array.prototype.customReverse = function () {
  const middle = Math.floor(this.length / 2);

  for (let i = 0; i < middle; i++) {
    const temp = this[i];
    this[i] = this[this.length - 1 - i];
    this[this.length - 1 - i] = temp;
  }

  return this;
};
```

### Challenge 1

slug: reverse-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2, 3];
console.log(JSON.stringify(values.customReverse()));
```

Options:

1. `[3,2,1]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,2,3]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[2,1,3]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
