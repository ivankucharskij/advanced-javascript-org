## 4. push

slug: push
topicSlug: array-methods
title: Implement Array.prototype.push
description: Appends each argument to an array and returns the updated length.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.push
sourceSnippet: push
language: js

```js
Array.prototype.customPush = function () {
  for (let i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
  }

  return this.length;
};
```

### Challenge 1

slug: push-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1];
console.log(values.customPush(2, 3));
console.log(values);
```

Options:

1. `3, then [1,2,3]`
   - correct: true
   - feedback: Correct. The snippet appends each argument to an array and returns the updated length, so the output is `3, then [1,2,3]`.

2. `[1,2,3], then 3`
   - correct: false
   - feedback: Not quite. The output is `3, then [1,2,3]`.

3. `2, then [1,2,3]`
   - correct: false
   - feedback: Not quite. The output is `3, then [1,2,3]`.
