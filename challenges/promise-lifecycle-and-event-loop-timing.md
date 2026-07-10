## 49. promise-lifecycle-and-event-loop-timing

slug: promise-lifecycle-and-event-loop-timing
topicSlug: event-loop
title: Promise Lifecycle Timing
description: Traces promise construction, resolution, and handler execution order.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise Lifecycle and Event Loop Timing
sourceSnippet: -
language: js

```js
const promise = new Promise((resolve, reject) => {
  console.log("Promise callback");
  resolve("resolved");
  console.log("Promise callback end");
}).then((result) => {
  console.log("Promise callback (.then)", result);
});

setTimeout(() => {
  console.log("event-loop cycle: Promise (fulfilled)", promise);
}, 0);

console.log("Promise (pending)", promise);
```

### Challenge 1

slug: promise-lifecycle-and-event-loop-timing-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Promise callback`, `Promise callback end`, `Promise (pending) ...`, `Promise callback (.then) resolved`, `event-loop cycle: Promise (fulfilled) ...`
   - correct: true
   - feedback: The source explains that the executor runs immediately, `.then()` runs after the current stack, and the timer runs after promise microtasks.

2. `Promise callback (.then) resolved`, then `Promise callback`
   - correct: false
   - feedback: The executor is the first part of the Promise to run; `.then()` cannot run before it.

3. `event-loop cycle: Promise (fulfilled) ...` before `Promise callback (.then) resolved`
   - correct: false
   - feedback: Promise microtasks run before zero-delay timer callbacks.
