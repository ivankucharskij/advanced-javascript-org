## 66. intersection

slug: intersection
topicSlug: lodash
title: Implement intersection
description: Returns values present in both arrays using Set membership.
sourceFile: apps/web/content/lodash.mdx
sourceSection: intersection
sourceSnippet: intersection
language: js

```js
const intersection = function (nums1, nums2) {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  const result = [];

  for (const nums of set2) {
    if (set1.has(nums)) {
      result.push(nums);
    }
  }

  return result;
};
```

### Challenge 1

slug: intersection-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify(intersection([1, 2, 3], [2, 3, 4])));
```

Options:

1. `[2,3]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,4]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[1,2,3,4]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
