## 8. splice

slug: splice
topicSlug: array-methods
title: Implement Array.prototype.splice
description: Normalizes splice arguments, removes a segment, inserts new items, and returns deleted values.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.splice
sourceSnippet: splice
language: js

```js
Array.prototype.customSplice = function (
  startIndex,
  deleteCount,
  ...itemsToAdd
) {
  const length = this.length;

  // Handle negative indices
  startIndex =
    startIndex < 0
      ? Math.max(length + startIndex, 0)
      : Math.min(startIndex, length);

  // If deleteCount is undefined, remove all elements starting from startIndex
  if (deleteCount === undefined) {
    deleteCount = length - startIndex;
  } else {
    // Normalize deleteCount
    deleteCount = Math.max(0, Math.min(deleteCount, length - startIndex));
  }

  // Extract the array to be deleted
  const splicedItems = this.slice(startIndex, startIndex + deleteCount);

  // Create the resulting this by combining parts and items to add
  const remainingItems = [
    ...this.slice(0, startIndex),
    ...itemsToAdd,
    ...this.slice(startIndex + deleteCount),
  ];

  // Update the original array
  this.length = 0; // Clear the this
  for (let i = 0; i < remainingItems.length; i++) {
    this[i] = remainingItems[i];
  }

  // Return the deleted items
  return splicedItems;
};
```

### Challenge 1

slug: splice-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [1, 2, 3, 4];
console.log(JSON.stringify(values.customSplice(1, 2, "a", "b")));
console.log(JSON.stringify(values));
```

Options:

1. `[2,3], then [1,"a","b",4]`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `["a","b"], then [1,2,3,4]`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `[2,3], then [1,4,"a","b"]`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: splice-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
const values = [1, 2, 3, 4];
console.log(JSON.stringify(values.customSplice(-2)));
console.log(JSON.stringify(values));
```

Options:

1. `[3,4], then [1,2]`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `[1,2], then [3,4]`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `[3,4], then [1,2,3,4]`
   - correct: false
   - feedback: This does not match the value printed by console.log.
