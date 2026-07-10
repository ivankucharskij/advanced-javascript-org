## 50. async-function-and-timer-execution-order

slug: async-function-and-timer-execution-order
topicSlug: event-loop
title: Async Function and Timer Ordering
description: Compares async function continuation timing with timers and script execution.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: Async Function and Timer Execution Order
sourceSnippet: -
language: js

```js
async function run() {
  console.log("run async");
  setTimeout(() => {
    console.log("run timeout");
  }, 0);
}

setTimeout(() => {
  console.log("timeout");
}, 0);

// await or not, same result
await run();

console.log("script");
```

### Challenge 1

slug: async-function-and-timer-execution-order-output
title: Predict async function and timer output order
prompt: What is the console output order?
code: null

Options:

1. `run async`, `script`, `timeout`, `run timeout`
   - correct: true
   - feedback: `run()` logs `run async` synchronously right away. After `await`, the continuation logs `script` as a microtask before any zero-delay timer callbacks, and the timers print later in registration order.

2. `run async`, `timeout`, `run timeout`, `script`
   - correct: false
   - feedback: Zero-delay timers are still delayed to later macrotasks. The awaited async continuation runs first as a microtask, so `script` prints before `timeout` and `run timeout`.

3. `timeout`, `run async`, `script`, `run timeout`
   - correct: false
   - feedback: The first `setTimeout` only schedules delayed work; it does not print immediately. `run()` is called in the current script, so `run async` prints right away before either timer callback.
