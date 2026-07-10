## 64. difference

slug: difference
topicSlug: lodash
title: Implement difference
description: Computes values that appear only on the left or only on the right array.
sourceFile: apps/web/content/lodash.mdx
sourceSection: difference
sourceSnippet: difference
language: js

```js
const findDifference = function (arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const diffLeft = [];
  const diffRight = [];

  for (const item of set1) {
    if (!set2.has(item)) diffLeft.push(item);
  }

  for (const item of set2) {
    if (!set1.has(item)) diffRight.push(item);
  }

  return [diffLeft, diffRight];
};
```

### Challenge 1

slug: difference-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(difference([1, 2, 3], [2, 4]));
```

Options:

1. `[1,3]`
   - correct: true
   - feedback: Correct. The snippet computes values that appear only on the left or only on the right array, so the output is `[1,3]`.

2. `[2]`
   - correct: false
   - feedback: Not quite. The output is `[1,3]`.

3. `[4]`
   - correct: false
   - feedback: Not quite. The output is `[1,3]`.
