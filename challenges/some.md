## 21. some

slug: some
topicSlug: array-methods
title: Implement Array.prototype.some
description: Checks whether at least one array item satisfies a predicate callback.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.some
sourceSnippet: some
language: js

```js
Array.prototype.customSome = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true;
    }
  }

  return false;
};
```

### Challenge 1

slug: some-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 3, 4].customSome((n) => n % 2 === 0));
```

Options:

1. `true`
   - correct: true
   - feedback: Correct. The snippet checks whether at least one array item satisfies a predicate callback, so the output is `true`.

2. `false`
   - correct: false
   - feedback: Not quite. The output is `true`.

3. `4`
   - correct: false
   - feedback: Not quite. The output is `true`.
