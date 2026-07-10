## 47. promise-chaining-and-microtask-queue-order

slug: promise-chaining-and-microtask-queue-order
topicSlug: event-loop
title: Promise Chain Microtask Order
description: Shows the order of chained promise handlers in the microtask queue.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Promise Chaining and Microtask Queue Order
sourceSnippet: -
language: js

```js
const promise1 = Promise.resolve();
const promise2 = Promise.resolve();

promise1.then(() => console.log(1)).then(() => console.log(2));
promise2.then(() => console.log(3)).then(() => console.log(4));
```

### Challenge 1

slug: promise-chaining-and-microtask-queue-order-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `1, 3, 2, 4`
   - correct: true
   - feedback: The source explains that each chained `.then()` schedules its next link only after its own handler runs, so the two chains interleave.

2. `1, 2, 3, 4`
   - correct: false
   - feedback: `promise1`'s second handler is queued only after its first handler runs, so `promise2`'s first handler runs before it.

3. `3, 4, 1, 2`
   - correct: false
   - feedback: The first chain is registered first, so its first handler prints before the second chain's first handler.
