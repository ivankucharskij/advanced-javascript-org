## 3. pop

slug: pop
topicSlug: array-methods
title: Implement Array.prototype.pop
description: Removes the last array element by shortening length and returns the removed value.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.pop
sourceSnippet: pop
language: js

```js
Array.prototype.customPop = function () {
  const length = this.length;

  if (length === 0) {
    return undefined;
  }

  const lastElement = this[length - 1];
  this.length = length - 1;

  return lastElement;
};
```

### Challenge 1

slug: pop-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2];
console.log(values.customPop());
console.log(JSON.stringify(values));
```

Options:

1. `2, then [1]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `1, then [2]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `2, then [1,2]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
