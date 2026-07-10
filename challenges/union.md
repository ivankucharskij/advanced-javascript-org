## 67. union

slug: union
topicSlug: lodash
title: Implement union
description: Combines arrays and removes duplicates with Set.
sourceFile: apps/web/content/lodash.mdx
sourceSection: union
sourceSnippet: union
language: js

```js
const union = (...arrays) => {
  return Array.from(new Set([].concat(...arrays)));
};
```

### Challenge 1

slug: union-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(union([1, 2], [2, 3]));
```

Options:

1. `[1,2,3]`
   - correct: true
   - feedback: Correct. The snippet combines arrays and removes duplicates with Set, so the output is `[1,2,3]`.

2. `[1,2,2,3]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,3]`.

3. `[2]`
   - correct: false
   - feedback: Not quite. The output is `[1,2,3]`.
