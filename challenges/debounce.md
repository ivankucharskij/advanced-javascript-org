## 42. debounce

slug: debounce
topicSlug: debounce-throttle
title: Implement debounce
description: Delays function execution until calls stop for the configured interval.
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Throttle and Debounce Decorators
sourceSnippet: debounce
language: js

```js
function debounce(func, ms) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
}

const timeLoggedConsoleLog = (...args) => {
  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);
};

const startTime = Date.now();
const f = debounce(timeLoggedConsoleLog, 500);

f("a");
setTimeout(() => f("b"), 200);
setTimeout(() => f("c"), 600);
setTimeout(() => f("d"), 600);
setTimeout(() => f("e"), 600); // Logged after 1118 ms: e
```

### Challenge 1

slug: debounce-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Logged after ... ms: e`
   - correct: true
   - feedback: Debounce clears the previous timer on each rapid call and starts a new one, so the wrapped function does not print right away. Only the final call runs after the configured 500 ms delay.

2. `Logged after ... ms: a`, `b`, `c`, `d`, `e`
   - correct: false
   - feedback: Debounced calls are postponed with `setTimeout`, not printed immediately. Rapid calls keep replacing the timer, so only the final call prints after the quiet period.

3. `Logged after ... ms: a`
   - correct: false
   - feedback: The first rapid call's timer is cleared by later calls. Nothing prints right away; after calls stop, the last scheduled call prints after the 500 ms delay.
