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
prompt: What does this code print?
code:

```js
console.log("executor now, then callback later");
```

Options:

1. `executor now, then callback later`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `then callback now, executor later`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `timer before executor`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
