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
prompt: What does this code print?
code:

```js
console.log("script and microtasks before rendering callback");
```

Options:

1. `script and microtasks before rendering callback`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `rendering callback before script`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `timer always before microtasks`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
