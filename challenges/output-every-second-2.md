## 41. output-every-second-2

slug: output-every-second-2
topicSlug: debounce-throttle
title: Timeout-Based Number Printer
description: Prints a range of numbers once per second using recursive setTimeout.
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Output Every Second
sourceSnippet: -
language: js

```js
function printNumbers(from, to) {
  let current = from;

  function go() {
    console.log(current);
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }

  go();
}

printNumbers(5, 10);
```

### Challenge 1

slug: output-every-second-2-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `5` immediately, then `6` through `10` with one-second gaps
   - correct: true
   - feedback: The source explains that recursive `setTimeout` schedules the next run after the current run finishes. Here the first `go()` call prints `5` immediately.

2. `5` through `10`, all after one second
   - correct: false
   - feedback: The first value is printed by the initial `go()` call before any timeout is scheduled.

3. `10` down to `5` with one-second gaps
   - correct: false
   - feedback: The function increments `current`, so it prints the range from `5` to `10`.
