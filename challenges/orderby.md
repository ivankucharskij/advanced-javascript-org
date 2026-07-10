## 61. orderby

slug: orderby
topicSlug: lodash
title: Implement orderBy
description: Sorts a copied array by a property in ascending or descending order.
sourceFile: apps/web/content/lodash.mdx
sourceSection: orderBy
sourceSnippet: orderBy
language: js

```js
function orderBy(array, property, order = "asc") {
  const multiplier = order === "asc" ? 1 : -1;
  const copy = [...array];

  return copy.sort((a, b) => {
    if (a[property] < b[property]) return -1 * multiplier;
    if (a[property] > b[property]) return 1 * multiplier;
    return 0;
  });
}
```

### Challenge 1

slug: orderby-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const users = [{ name: "Ada", age: 30 }, { name: "Linus", age: 20 }];
console.log(orderBy(users, "age", "desc")[0].name);
```

Options:

1. `Ada`
   - correct: true
   - feedback: Correct. The snippet sorts a copied array by a property in ascending or descending order, so the output is `Ada`.

2. `Linus`
   - correct: false
   - feedback: Not quite. The output is `Ada`.

3. `undefined`
   - correct: false
   - feedback: Not quite. The output is `Ada`.
