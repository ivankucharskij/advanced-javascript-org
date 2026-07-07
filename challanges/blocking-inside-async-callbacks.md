## 53. blocking-inside-async-callbacks

slug: blocking-inside-async-callbacks
topicSlug: event-loop
title: Blocking Work Inside Async Callbacks
description: Shows that synchronous work inside an async callback still blocks later tasks.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Blocking Inside Async Callbacks
sourceSnippet: -
language: js

```js
function longRunningTask() {
  console.log("Start Long-Running Task");

  const startTime = Date.now();
  while (Date.now() - startTime < 2000) {
    // Simulate a long-running task (2 seconds)
  }

  console.log("Long-Running Task Completed");
}

function simulateNonBlocking() {
  console.log("Start");

  setTimeout(() => {
    console.log("Non-blocking Operation");
    longRunningTask();
  }, 0);

  console.log("End");
}

simulateNonBlocking();
```

### Challenge 1

slug: blocking-inside-async-callbacks-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log("microtask can block later timers");
```

Options:

1. `microtask can block later timers`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `timer always runs before microtask`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `blocking inside callback is ignored`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
