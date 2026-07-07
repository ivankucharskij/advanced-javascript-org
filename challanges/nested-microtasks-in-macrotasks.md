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
prompt: What does this code print?
code:

```js
console.log("timer callback, then nested microtasks before next timer");
```

Options:

1. `timer callback, then nested microtasks before next timer`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `all timers before nested microtasks`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `nested microtasks before script`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
