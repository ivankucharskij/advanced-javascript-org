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
prompt: What does this code print?
code:

```js
console.log("synchronous logs first, chained then callbacks later");
```

Options:

1. `synchronous logs first, chained then callbacks later`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `chained then callbacks first`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `timers run before chained then callbacks`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
