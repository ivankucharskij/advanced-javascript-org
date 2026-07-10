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
code: null

Options:

1. `[ 'Alice', 'Charlie' ]`
   - correct: true
   - feedback: Correct. The snippet filters active people and maps the kept values to names, so the logged array contains Alice and Charlie.

2. `[ 'Bob' ]`
   - correct: false
   - feedback: Bob is filtered out because `active` is false.

3. `[ 'Alice', 'Bob', 'Charlie' ]`
   - correct: false
   - feedback: The map callback returns names, but only for people that pass the active filter.
