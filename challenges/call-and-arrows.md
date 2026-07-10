## 32. call-and-arrows

slug: call-and-arrows
topicSlug: core-concepts
title: call with Regular and Arrow Functions
description: Compares how call affects regular methods versus arrow functions.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: `call` with Regular and Arrow Functions
sourceSnippet: call and arrows
language: js

```js
const obj = {
  value: 25,
  regularMethod() {
    return this.value;
  },
  arrowMethod: () => {
    return this?.value;
  },
};

const anotherObj = {
  value: 50,
};
```

### Challenge 1

slug: call-and-arrows-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(obj.regularMethod.call(anotherObj));
console.log(obj.arrowMethod.call(anotherObj));
```

Options:

1. `50, then undefined`
   - correct: true
   - feedback: Correct. The snippet compares how call affects regular methods versus arrow functions, so the output is `50, then undefined`.

2. `25, then 50`
   - correct: false
   - feedback: Not quite. The output is `50, then undefined`.

3. `50, then 50`
   - correct: false
   - feedback: Not quite. The output is `50, then undefined`.

### Challenge 2

slug: call-and-arrows-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(obj.regularMethod());
console.log(obj.arrowMethod());
```

Options:

1. `25, then undefined`
   - correct: true
   - feedback: Correct. This follows the same implementation, so the output is `25, then undefined`.

2. `25, then 25`
   - correct: false
   - feedback: Not quite. This edge case outputs `25, then undefined`.

3. `undefined, then undefined`
   - correct: false
   - feedback: Not quite. This edge case outputs `25, then undefined`.
