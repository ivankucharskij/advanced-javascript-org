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
```

### Challenge 1

slug: debounce-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log("only the final rapid call runs after the delay");
```

Options:

1. `only the final rapid call runs after the delay`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `every rapid call runs immediately`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `the first rapid call runs after the delay`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
