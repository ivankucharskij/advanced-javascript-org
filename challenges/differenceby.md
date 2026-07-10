## 65. differenceby

slug: differenceby
topicSlug: lodash
title: Implement differenceBy
description: Computes object differences by comparing a selected property value.
sourceFile: apps/web/content/lodash.mdx
sourceSection: differenceBy
sourceSnippet: differenceBy
language: js

```js
const differenceBy = (arr1, arr2, key) => {
  const set2 = new Set(arr2.map((item) => item[key]));
  const set1 = new Set(arr1.map((item) => item[key]));

  const diffLeft = [];
  const diffRight = [];

  for (const item of arr1) {
    if (!set2.has(item[key])) {
      diffLeft.push(item);
    }
  }

  for (const item of arr2) {
    if (!set1.has(item[key])) {
      diffRight.push(item);
    }
  }

  return [diffLeft, diffRight];
};
```

### Challenge 1

slug: differenceby-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const left = [{ id: 1 }, { id: 2 }];
const right = [{ id: 2 }, { id: 3 }];
console.log(differenceBy(left, right, "id"));
```

Options:

1. `[[{"id":1}],[{"id":3}]]`
   - correct: true
   - feedback: Correct. The snippet computes object differences by comparing a selected property value, so the output is `[[{"id":1}],[{"id":3}]]`.

2. `[{"id":1},{"id":3}]`
   - correct: false
   - feedback: Not quite. The output is `[[{"id":1}],[{"id":3}]]`.

3. `[[{"id":2}],[]]`
   - correct: false
   - feedback: Not quite. The output is `[[{"id":1}],[{"id":3}]]`.
