## 18. at

slug: at
topicSlug: array-methods
title: Implement Array.prototype.at
description: Reads an array value by index, including negative offsets from the end.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.at
sourceSnippet: at
language: js

```js
Array.prototype.customAt = function (index) {
  if (index < 0) {
    index = this.length + index;
  }

  return this[index];
};
```

### Challenge 1

slug: at-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(["a", "b", "c"].customAt(-1));
```

Options:

1. `c`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `a`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
