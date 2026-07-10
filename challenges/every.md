## 19. every

slug: every
topicSlug: array-methods
title: Implement Array.prototype.every
description: Checks whether all array items satisfy a predicate callback.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.every
sourceSnippet: every
language: js

```js
Array.prototype.customEvery = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i)) {
      return false;
    }
  }

  return true;
};
```

### Challenge 1

slug: every-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([2, 4, 6].customEvery((n) => n % 2 === 0));
```

Options:

1. `true`
   - correct: true
   - feedback: Correct. The snippet checks whether all array items satisfy a predicate callback, so the output is `true`.

2. `false`
   - correct: false
   - feedback: Not quite. The output is `true`.

3. `undefined`
   - correct: false
   - feedback: Not quite. The output is `true`.
