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
prompt: What does this code print?
code:

```js
console.log("script, microtasks, timers");
```

Options:

1. `script, microtasks, timers`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `script, timers, microtasks`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `microtasks, script, timers`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
