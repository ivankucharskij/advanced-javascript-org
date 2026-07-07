## 45. dictionary-of-nested-2

slug: dictionary-of-nested-2
topicSlug: dictionary-of-nested
title: Nested Dictionary with Recursion
description: Builds nested lookup dictionaries recursively from configurable child keys.
sourceFile: apps/web/content/dictionary-of-nested.mdx
sourceSection: Recursive Helper: `mapToDictionary()`
sourceSnippet: dictionary of nested
language: js

```js
const data = [
  {
    id: 1,
    name: "Category A",
    items: [
      {
        id: 2,
        name: "Subcategory A1",
        items: [
          { id: 3, name: "Item A1-1", value: 10 },
          { id: 4, name: "Item A1-2", value: 15 },
        ],
      },
      {
        id: 5,
        name: "Subcategory A2",
        items: [
          { id: 6, name: "Item A2-1", value: 20 },
          { id: 7, name: "Item A2-2", value: 25 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Category B",
    items: [
      {
        id: 9,
        name: "Subcategory B1",
        items: [
          { id: 10, name: "Item B1-1", value: 30 },
          { id: 11, name: "Item B1-2", value: 35 },
        ],
      },
      {
        id: 12,
        name: "Subcategory B2",
        items: [
          { id: 13, name: "Item B2-1", value: 40 },
          { id: 14, name: "Item B2-2", value: 45 },
        ],
      },
    ],
  },
];

function mapToDictionary(data, keys) {
  const [currentKey, ...remainingKeys] = keys;

  return data.reduce((acc, item) => {
    acc[item.id] = {
      ...item,
      [currentKey || "items"]: item.items
        ? mapToDictionary(item.items, remainingKeys)
        : undefined,
    };
    return acc;
  }, {});
}

const nestedDictionary = mapToDictionary(data, ["subcategories", "items"]);
```

### Challenge 1

slug: dictionary-of-nested-2-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(nestedDictionary[8].subcategories[12].items[14].value);
```

Options:

1. `45`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `40`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: dictionary-of-nested-2-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(nestedDictionary[1].subcategories[5].items[7].name);
```

Options:

1. `Item A2-2`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `Subcategory A2`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `undefined`
   - correct: false
   - feedback: This does not match the value printed by console.log.
