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
console.log(JSON.stringify(union([1, 2], [2, 3])));
```

Options:

1. `[1,2,3]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `[1,2,2,3]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[2]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
