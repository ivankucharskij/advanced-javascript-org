## 1. concat

slug: concat
topicSlug: array-methods
title: Implement Array.prototype.concat
description: Combines the receiver with arrays or individual values and returns a new array.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.concat
sourceSnippet: concat
language: js

```js
Array.prototype.myConcat = function (...arrays) {
  const result = [...this];

  for (const array of arrays) {
    if (Array.isArray(array)) {
      result.push(...array);
    } else {
      result.push(array);
    }
  }

  return result;
};
```

### Challenge 1

slug: concat-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const numbers = [1, 2];
console.log(JSON.stringify(numbers.myConcat([3, 4], 5)));
```

Options:

1. `[1,2,3,4,5]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,2,[3,4],5]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[3,4,5]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
