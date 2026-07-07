## 60. omit

slug: omit
topicSlug: lodash
title: Implement omit
description: Returns a shallow object copy with one or more keys removed.
sourceFile: apps/web/content/lodash.mdx
sourceSection: omit
sourceSnippet: omit
language: js

```js
function omit(obj, keys) {
  const result = { ...obj };

  if (!Array.isArray(keys)) {
    delete result[keys];
    return result;
  }

  for (const key of keys) {
    delete result[key];
  }

  return result;
}
```

### Challenge 1

slug: omit-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify(omit({ a: 1, b: 2, c: 3 }, ["b"])));
```

Options:

1. `{"a":1,"c":3}`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `{"b":2}`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `{"a":1,"b":2,"c":3}`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
