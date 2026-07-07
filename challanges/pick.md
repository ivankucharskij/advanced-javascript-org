## 62. pick

slug: pick
topicSlug: lodash
title: Implement pick
description: Returns a new object containing only selected existing keys.
sourceFile: apps/web/content/lodash.mdx
sourceSection: pick
sourceSnippet: pick
language: js

```js
function pick(obj, keys) {
  if (typeof keys === "string") {
    return obj[keys] !== undefined ? { [keys]: obj[keys] } : {};
  }

  return (Array.isArray(keys) ? keys : []).reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
```

### Challenge 1

slug: pick-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])));
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
