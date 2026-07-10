## 7. unshift

slug: unshift
topicSlug: array-methods
title: Implement Array.prototype.unshift
description: Prepends values by shifting existing elements right and returns the new length.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.unshift
sourceSnippet: unshift
language: js

```js
Array.prototype.customUnshift = function (...elements) {
  const originalLength = this.length;
  const totalLength = elements.length + originalLength;

  // Shift existing elements to the right
  for (let i = originalLength - 1; i >= 0; i--) {
    this[i + elements.length] = this[i];
  }

  // Add new elements at the beginning
  for (let i = 0; i < elements.length; i++) {
    this[i] = elements[i];
  }

  return totalLength; // Return the new length
};
```

### Challenge 1

slug: unshift-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const values = [3, 4];
console.log(values.customUnshift(1, 2));
console.log(values);
```

Options:

1. `4, then [1,2,3,4]`
   - correct: true
   - feedback: Correct. The snippet prepends values by shifting existing elements right and returns the new length, so the output is `4, then [1,2,3,4]`.

2. `2, then [1,2,3,4]`
   - correct: false
   - feedback: Not quite. The output is `4, then [1,2,3,4]`.

3. `4, then [3,4,1,2]`
   - correct: false
   - feedback: Not quite. The output is `4, then [1,2,3,4]`.
