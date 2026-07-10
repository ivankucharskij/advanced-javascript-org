## 46. promise-all-and-the-event-loop

slug: promise-all-and-the-event-loop
topicSlug: event-loop
title: Promise.all and Event Loop Timing
description: Combines resolved and delayed promises to inspect Promise.all scheduling.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise.all and the Event Loop
sourceSnippet: -
language: js

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "foo");
});
const promise3 = 42;

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log({ values });
});

// Using setTimeout, we can execute code after the queue is empty
setTimeout(() => {
  console.log("the queue is now empty");
});

const p3 = Promise.all([]); // Will be immediately resolved
const p4 = Promise.all([1337, "hi"]);

// Non-promise values are ignored, but the evaluation is done asynchronously
console.log({ p3 });
console.log({ p4 });

setTimeout(() => {
  console.log({ p4 });
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log({ values2: values });
});

const promise4 = Promise.resolve(3);
const promise5 = 42;

Promise.all([promise4, promise5]).then((values) => {
  console.log({ values3: values });
});
```

### Challenge 1

slug: promise-all-and-the-event-loop-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `{ p3: Promise { [] } }`, `{ p4: Promise { <pending> } }`, `{ values3: [3, 42] }`, timer logs, then delayed `values` logs
   - correct: true
   - feedback: The source notes that non-promise values are treated as resolved, but evaluation still runs asynchronously. The Promise.all containing the 1000 ms timer resolves after that timer.

2. `{ values: [3, "foo", 42] }` before `{ values3: [3, 42] }`
   - correct: false
   - feedback: `values3` depends only on an already resolved promise and a plain value, so it resolves before the Promise.all that waits for `"foo"`.

3. `the queue is now empty` before the initial `{ p3 }` and `{ p4 }` logs
   - correct: false
   - feedback: The initial `{ p3 }` and `{ p4 }` logs are part of the current script, so they happen before the timer callback.
