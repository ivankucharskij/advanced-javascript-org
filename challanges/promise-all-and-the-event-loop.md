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
prompt: What does this code print?
code:

```js
console.log("script first, promise callbacks before timers");
```

Options:

1. `script first, promise callbacks before timers`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `timers before promise callbacks`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `promise callbacks before script`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
