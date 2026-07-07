## 44. dictionary-of-nested

slug: dictionary-of-nested
topicSlug: dictionary-of-nested
title: Nested Dictionary with Loops
description: Builds nested lookup dictionaries from a fixed three-level data structure.
sourceFile: apps/web/content/dictionary-of-nested.mdx
sourceSection: Plain JavaScript: Nested Loop Approach
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

function createNestedDictionary(data) {
  const dictionary = {};

  for (const category of data) {
    dictionary[category.id] = { ...category, subcategories: {} };

    for (const subcategory of category.items) {
      dictionary[category.id].subcategories[subcategory.id] = {
        ...subcategory,
        items: {},
      };

      for (const item of subcategory.items) {
        dictionary[category.id].subcategories[subcategory.id].items[item.id] =
          item;
      }
    }
  }

  return dictionary;
}

const nestedDictionary = createNestedDictionary(data);
```

### Challenge 1

slug: dictionary-of-nested-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(nestedDictionary[1].subcategories[2].items[4].value);
```

Options:

1. `15`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `10`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: dictionary-of-nested-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(Object.keys(nestedDictionary[8].subcategories).join(","));
```

Options:

1. `9,12`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `10,11`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `1,8`
   - correct: false
   - feedback: This does not match the value printed by console.log.
