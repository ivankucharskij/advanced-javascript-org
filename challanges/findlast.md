## 17. findlast

slug: findlast
topicSlug: array-methods
title: Implement Array.prototype.findLast
description: Scans from the end to return the last item that satisfies a predicate callback.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.findLast
sourceSnippet: findLast
language: js

```js
Array.prototype.customFindLast = function (callback) {
  for (let i = this.length; i >= 0; i--) {
    if (callback(this[i])) {
      return this[i];
    }
  }
};
```

### Challenge 1

slug: findlast-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 4, 6].customFindLast((n) => n > 3));
```

Options:

1. `6`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `4`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
