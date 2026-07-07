## 13. map

slug: map
topicSlug: array-methods
title: Implement Array.prototype.map
description: Transforms every array item with a callback and returns the mapped values.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.map
sourceSnippet: map
language: js

```js
Array.prototype.customMap = function (callbackFn) {
  if (typeof callbackFn !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const arr = [];
  for (let i = 0; i < this.length; i++) {
    arr.push(callbackFn(this[i], i, this));
  }

  return arr;
};
```

### Challenge 1

slug: map-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify([1, 2, 3].customMap((n) => n * 2)));
```

Options:

1. `[2,4,6]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,2,3]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[2,3,4]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
