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
   - feedback: `run()` logs synchronously before the `await` resolves. The continuation after `await` runs as a microtask before the timer callbacks, and the timers run in registration order.

2. `run async`, `timeout`, `run timeout`, `script`
   - correct: false
   - feedback: Timer callbacks do not run before the awaited async function continuation. The `console.log("script")` line runs before timers.

3. `timeout`, `run async`, `script`, `run timeout`
   - correct: false
   - feedback: The first `setTimeout` only schedules a timer. `run()` is called before any timer callback executes, so `run async` appears before `timeout`.
