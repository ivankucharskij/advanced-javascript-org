## 59. keyby

slug: keyby
topicSlug: lodash
title: Implement keyBy
description: Indexes collection items by a property name or iteratee result.
sourceFile: apps/web/content/lodash.mdx
sourceSection: keyBy
sourceSnippet: keyBy
language: js

```js
function keyBy(collection, iteratee) {
  const result = {};

  for (const item of collection) {
    const key =
      typeof iteratee === "function" ? iteratee(item) : item[iteratee];
    result[key] = item;
  }

  return result;
}
```

### Challenge 1

slug: keyby-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const users = [{ id: "a", name: "Ada" }, { id: "b", name: "Brendan" }];
console.log(keyBy(users, "id").b.name);
```

Options:

1. `Brendan`
   - correct: true
   - feedback: Correct. The snippet indexes collection items by a property name or iteratee result, so the output is `Brendan`.

2. `Ada`
   - correct: false
   - feedback: Not quite. The output is `Brendan`.

3. `undefined`
   - correct: false
   - feedback: Not quite. The output is `Brendan`.
