## 51. blocking-the-event-loop-with-a-while-loop

slug: blocking-the-event-loop-with-a-while-loop
topicSlug: event-loop
title: Blocking the Event Loop with a While Loop
description: Blocks the main thread to show how synchronous work delays timers.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Blocking the Event Loop with a While Loop
sourceSnippet: -
language: js

```js
const seconds = new Date().getTime() / 1000;

setTimeout(() => {
  // prints out "2", meaning that the callback is not called immediately after 500 milliseconds.
  console.log(`Ran after ${new Date().getTime() / 1000 - seconds} seconds`);
}, 500);

while (true) {
  if (new Date().getTime() / 1000 - seconds >= 2) {
    console.log("Good, looped for 2 seconds");
    break;
  }
}
```

### Challenge 1

slug: blocking-the-event-loop-with-a-while-loop-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Good, looped for 2 seconds`, then `Ran after ... seconds` at roughly 2 seconds
   - correct: true
   - feedback: The source explains that the 500 ms timer is delayed until the blocking loop finishes, which is after roughly two seconds.

2. `Ran after 0.5 seconds`, then `Good, looped for 2 seconds`
   - correct: false
   - feedback: A timer callback cannot interrupt synchronous JavaScript that is already running.

3. `Good, looped for 2 seconds` only
   - correct: false
   - feedback: The loop delays the timer, but it does not cancel the scheduled callback.
