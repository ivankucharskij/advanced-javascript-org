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
   - feedback: Correct. The snippet reads an array value by index, including negative offsets from the end, so the output is `c`.

2. `a`
   - correct: false
   - feedback: Not quite. The output is `c`.

3. `undefined`
   - correct: false
   - feedback: Not quite. The output is `c`.
