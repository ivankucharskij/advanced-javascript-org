## 43. throttle

slug: throttle
topicSlug: debounce-throttle
title: Implement throttle
description: Allows one function call per interval while ignoring extra calls.
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Throttle and Debounce Decorators
sourceSnippet: throttle
language: js

```js
function throttle(fn, limit) {
  let inThrottle;

  return function (...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
}

const timeLoggedConsoleLog = (...args) => {
  console.log(`Logged after ${Date.now() - startTime} ms:`, ...args);
};

const startTime = Date.now();
const f = throttle(timeLoggedConsoleLog, 500);
```

### Challenge 1

slug: throttle-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `Logged after 0 ms: a`, then around 600 ms `Logged after ... ms: c`
   - correct: true
   - feedback: The source contrasts throttle with debounce: throttle allows a call immediately, then blocks further calls until the time window ends.

2. `Logged after ... ms: e` only
   - correct: false
   - feedback: That is closer to debounce. Throttle runs the first call immediately.

3. `Logged after 0 ms: a`, `b`, `c`, `d`, `e`
   - correct: false
   - feedback: Calls inside the throttle window are ignored, so `b`, `d`, and `e` do not all print.
