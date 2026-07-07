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
prompt: What does this code print?
code:

```js
console.log("blocking loop delays timer output");
```

Options:

1. `blocking loop delays timer output`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `timer interrupts blocking loop`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `blocking loop cancels timer`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
