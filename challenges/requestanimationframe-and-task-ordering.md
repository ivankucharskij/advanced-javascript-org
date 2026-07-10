## 55. requestanimationframe-and-task-ordering

slug: requestanimationframe-and-task-ordering
topicSlug: event-loop
title: requestAnimationFrame and Task Ordering
description: Compares requestAnimationFrame, promise microtasks, timers, and script logs.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: requestAnimationFrame and Task Ordering
sourceSnippet: -
language: js

```js
console.log("1");

setTimeout(function () {
  console.log("2");

  Promise.resolve().then(function () {
    console.log("3");
  });
}, 0);

Promise.resolve().then(function () {
  console.log("4");

  setTimeout(function () {
    console.log("5");
  }, 0);
});

requestAnimationFrame(function () {
  console.log("7");
});

console.log("6");
```

### Challenge 1

slug: requestanimationframe-and-task-ordering-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `1, 6, 4, 2, 3, 5, 7`
   - correct: true
   - feedback: The source states that promise microtasks run before macrotasks, and `requestAnimationFrame` is queued before the next paint after the other queues are cleared.

2. `1, 6, 7, 4, 2, 3, 5`
   - correct: false
   - feedback: `requestAnimationFrame` does not run as soon as it is registered; it waits for the frame phase.

3. `1, 2, 3, 4, 5, 6, 7`
   - correct: false
   - feedback: The synchronous `6` prints before any queued callback, and the promise callback `4` runs before the timer callback `2`.
