## 54. nested-microtasks-in-macrotasks

slug: nested-microtasks-in-macrotasks
topicSlug: event-loop
title: Nested Microtasks Inside Macrotasks
description: Demonstrates how microtasks queued inside a timer run before the next timer.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Nested Microtasks in Macrotasks
sourceSnippet: -
language: js

```js
console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("Promise inside setTimeout 1");
  });
}, 0);

setTimeout(() => {
  console.log("setTimeout 2");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

console.log("End");
```

### Challenge 1

slug: nested-microtasks-in-macrotasks-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Start`, `End`, `Promise 1`, `Promise 2`, `setTimeout 1`, `Promise inside setTimeout 1`, `setTimeout 2`
   - correct: true
   - feedback: The source explains that microtasks run before macrotasks, and a microtask queued inside a timer runs immediately after that timer callback finishes.

2. `Start`, `End`, `setTimeout 1`, `setTimeout 2`, `Promise 1`, `Promise 2`, `Promise inside setTimeout 1`
   - correct: false
   - feedback: Initial promise callbacks run before timers, and the nested promise callback runs before the second timer.

3. `Promise 1`, `Promise 2`, `Start`, `End`, `setTimeout 1`, `setTimeout 2`
   - correct: false
   - feedback: The script logs `Start` and `End` before any queued promise or timer callback runs.
