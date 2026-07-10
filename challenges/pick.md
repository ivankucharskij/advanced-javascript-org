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
console.log(pick({ a: 1, b: 2, c: 3 }, ["a", "c"]));
```

Options:

1. `{"a":1,"c":3}`
   - correct: true
   - feedback: Correct. The snippet returns a new object containing only selected existing keys, so the output is `{"a":1,"c":3}`.

2. `{"b":2}`
   - correct: false
   - feedback: Not quite. The output is `{"a":1,"c":3}`.

3. `{"a":1,"b":2,"c":3}`
   - correct: false
   - feedback: Not quite. The output is `{"a":1,"c":3}`.
