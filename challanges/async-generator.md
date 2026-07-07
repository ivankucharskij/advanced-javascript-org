## 34. async-generator

slug: async-generator
topicSlug: core-concepts
title: Async Generator Sequence
description: Yields asynchronous values over time and consumes them with for await.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Async Generators
sourceSnippet: async generator
language: js

```js
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield i;
  }
}

const timer = async (callback) => {
  const generator = generateSequence(1, 5);
  for await (let value of generator) {
    callback(value);
  }
};
```

### Challenge 1

slug: async-generator-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
timer((value) => console.log(value));
```

Options:

1. `1, 2, 3, 4, 5`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `5, 4, 3, 2, 1`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `Promise, Promise, Promise`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
