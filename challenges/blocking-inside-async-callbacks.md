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
prompt: What does the snippet print?
code: null

Options:

1. `Start`, `End`, `Non-blocking Operation`, `Start Long-Running Task`, then after about 2s `Long-Running Task Completed`
   - correct: true
   - feedback: The source explains that scheduling with `setTimeout` does not make the callback's long synchronous work interruptible. The callback starts after `Start` and `End`, then its loop blocks until completion.

2. `Start`, `Non-blocking Operation`, `End`, `Start Long-Running Task`, `Long-Running Task Completed`
   - correct: false
   - feedback: The timer callback does not run before the current script finishes, so `End` appears before `Non-blocking Operation`.

3. `Start`, `End`, `Non-blocking Operation`, `Long-Running Task Completed`, `Start Long-Running Task`
   - correct: false
   - feedback: `longRunningTask()` logs its start before entering the blocking loop, then logs completion after the loop finishes.
