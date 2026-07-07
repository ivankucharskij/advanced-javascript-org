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
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `25, then 50`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `50, then 50`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

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
   - feedback: This output follows the edge-case behavior in the snippet.

2. `25, then 25`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `undefined, then undefined`
   - correct: false
   - feedback: This does not match the value printed by console.log.
