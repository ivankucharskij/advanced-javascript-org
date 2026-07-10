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
console.log(intersection([1, 2, 3], [2, 3, 4]));
```

Options:

1. `[2,3]`
   - correct: true
   - feedback: Correct. The snippet returns values present in both arrays using Set membership, so the output is `[2,3]`.

2. `[1,4]`
   - correct: false
   - feedback: Not quite. The output is `[2,3]`.

3. `[1,2,3,4]`
   - correct: false
   - feedback: Not quite. The output is `[2,3]`.
