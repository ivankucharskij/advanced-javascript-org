## 52. script-microtasks-and-macrotasks-in-execution-order

slug: script-microtasks-and-macrotasks-in-execution-order
topicSlug: event-loop
title: Script, Microtask, and Macrotask Order
description: Interleaves script logs, promise jobs, queued microtasks, and timers.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Script, Microtasks, and Macrotasks in Execution Order
sourceSnippet: -
language: js

```js
console.log("Script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

console.log("Script end");

const promise1 = new Promise((resolve, reject) => {
  console.log("Promise constructor");
  resolve();
}).then(() => {
  console.log("Promise constructor resolve");
});

queueMicrotask(() => {
  console.log("Microtask queue");
});

console.log("After Promise constructor");
```

### Challenge 1

slug: script-microtasks-and-macrotasks-in-execution-order-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Script start`, `Script end`, `Promise constructor`, `After Promise constructor`, `Promise 1`, `Promise constructor resolve`, `Microtask queue`, `Promise 2`, `setTimeout`
   - correct: true
   - feedback: The source summarizes the rule: synchronous code runs first, then promise and queued microtasks, then timer macrotasks.

2. `Script start`, `setTimeout`, `Script end`, `Promise 1`, `Promise 2`
   - correct: false
   - feedback: The zero-delay timer is a macrotask, so it waits until after the current script and microtasks.

3. `Promise 1`, `Promise 2`, `Script start`, `Script end`, `setTimeout`
   - correct: false
   - feedback: Promise callbacks do not run before the current script reaches the end.
