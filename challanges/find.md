## 16. find

slug: find
topicSlug: array-methods
title: Implement Array.prototype.find
description: Returns the first item that satisfies a predicate callback.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.find
sourceSnippet: find
language: js

```js
Array.prototype.customFind = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i])) {
      return this[i];
    }
  }
};
```

### Challenge 1

slug: find-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 4, 6].customFind((n) => n > 3));
```

Options:

1. `4`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `6`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
