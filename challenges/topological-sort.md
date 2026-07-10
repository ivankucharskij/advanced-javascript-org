## 78. topological-sort

slug: topological-sort
topicSlug: random
title: Topological Sort by Dependencies
description: Orders cards by dependencies and detects unresolved dependency cycles.
sourceFile: apps/web/content/random.mdx
sourceSection: Topological Sort
sourceSnippet: topological sort
language: js

```js
const cards = [
  { id: 1, dependent: [6, 7, 8] },
  { id: 2, dependent: [6] },
  { id: 3, dependent: [] },
  { id: 4, dependent: [6, 7, 8] },
  { id: 5, dependent: [6, 8] },
  { id: 6, dependent: [] },
  { id: 7, dependent: [6] },
  { id: 8, dependent: [7] },
  { id: 9, dependent: [1] },
  { id: 10, dependent: [9] },
];

const getOrderedCards = (cards) => {
  const result = [];
  const added = new Set();

  while (result.length < cards.length) {
    let addedInPass = false;

    for (const card of cards) {
      if (
        !added.has(card.id) &&
        card.dependent.every((dep) => added.has(dep))
      ) {
        result.push(card.id);
        added.add(card.id);
        addedInPass = true;
      }
    }

    if (!addedInPass) {
      throw new Error("Cannot resolve dependency order");
    }
  }

  return result;
};

console.log(getOrderedCards(cards));
```

### Challenge 1

slug: topological-sort-console-output
title: Predict the console output
prompt: What does this code print?
code:

Options:

1. `3,6,7,8,1,2,4,5,9,10`
   - correct: true
   - feedback: Correct. The snippet logs the full dependency order produced by the pass-based algorithm.

2. `1,2,3`
   - correct: false
   - feedback: Not quite. Cards with dependencies cannot appear before their required cards.

3. `6,7,8`
   - correct: false
   - feedback: Not quite. The full output starts with `3,6,7,8` and continues through all ten cards.

### Challenge 2

slug: topological-sort-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(getOrderedCards([{ id: 1, dependent: [] }, { id: 2, dependent: [1] }]).join(","));
```

Options:

1. `3,6,7,8,1,2,4,5,9,10, then 1,2`
   - correct: true
   - feedback: Correct. The reusable snippet logs the full `cards` order first, then the edge-case code logs `1,2`.

2. `2,1`
   - correct: false
   - feedback: Not quite. Card `2` depends on card `1`, so `2,1` is invalid.

3. `1,2`
   - correct: false
   - feedback: Not quite. The edge-case output is `1,2`, but the reusable snippet's full output appears before it.
