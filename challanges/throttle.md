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
prompt: What does this code print?
code:

```js
console.log("at most one call runs per interval");
```

Options:

1. `at most one call runs per interval`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `only the final call ever runs`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `all calls run immediately`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
