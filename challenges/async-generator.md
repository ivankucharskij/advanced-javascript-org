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
   - feedback: The async generator waits one second before each `yield`, and `for await` consumes those yielded values in order. The values are not printed right away; console.log prints `1`, then `2`, `3`, `4`, and `5` with about a one-second delay between each value.

2. `5, 4, 3, 2, 1`
   - correct: false
   - feedback: The async generator counts upward from `start` to `end`, waiting one second before each `yield`. The values are printed with a delay, not right away, and the order is `1`, `2`, `3`, `4`, `5`.

3. `Promise, Promise, Promise`
   - correct: false
   - feedback: `for await` waits for each async generator step and passes the resolved yielded number to the callback. It does not print promises; it prints `1`, `2`, `3`, `4`, and `5` with about a one-second delay between each value.
