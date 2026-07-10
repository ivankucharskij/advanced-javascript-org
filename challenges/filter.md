## 9. filter

slug: filter
topicSlug: array-methods
title: Implement Array.prototype.filter
description: Builds a new array containing only items that pass the callback predicate.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.filter
sourceSnippet: filter
language: js

```js
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};
```

### Challenge 1

slug: filter-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log([1, 2, 3, 4].customFilter((n) => n % 2 === 0));
```

Options:

1. `[2,4]`
   - correct: true
   - feedback: Correct. The snippet builds a new array containing only items that pass the callback predicate, so the output is `[2,4]`.

2. `[1,3]`
   - correct: false
   - feedback: Not quite. The output is `[2,4]`.

3. `[1,2,3,4]`
   - correct: false
   - feedback: Not quite. The output is `[2,4]`.
