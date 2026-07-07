## 75. filtermap

slug: filtermap
topicSlug: random
title: Implement filterMap
description: Filters items and maps the kept values in a single reduce pass.
sourceFile: apps/web/content/random.mdx
sourceSection: filterMap
sourceSnippet: filterMap
language: js

```js
export const filterMap = (array, filterBoolean, mapCallback) => {
  return array.reduce((acc, item, idx) => {
    if (filterBoolean(item)) {
      acc.push(mapCallback(item, idx));
    }
    return acc;
  }, []);
};

const people = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: false },
  { name: "Charlie", age: 35, active: true },
];

const activeNames = filterMap(
  people,
  (person) => person.active,
  (person) => person.name,
);

console.log(activeNames)
```

### Challenge 1

slug: filtermap-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(JSON.stringify(activeNames));
```

Options:

1. `["Alice","Charlie"]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `["Bob"]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `["Alice","Bob","Charlie"]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
