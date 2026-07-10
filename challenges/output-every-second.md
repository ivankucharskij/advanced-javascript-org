## 40. output-every-second

slug: output-every-second
topicSlug: debounce-throttle
title: Interval-Based Number Printer
description: Prints a range of numbers once per second using setInterval.
sourceFile: apps/web/content/debounce-throttle.mdx
sourceSection: Output Every Second
sourceSnippet: -
language: js

```js
function printNumbers(from, to) {
  let current = from;
  let timerId;

  function go() {
    console.log(current);
    if (current === to) {
      clearInterval(timerId);
    }
    current++;
  }

  go();
  timerId = setInterval(go, 1000);
}

printNumbers(5, 10);
```

### Challenge 1

slug: output-every-second-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `5` immediately, then `6` through `10` with one-second gaps
   - correct: true
   - feedback: The source says the first call to `go()` prints `5` immediately, then `setInterval` repeats until the range reaches `10`.

2. `5` through `10`, all after one second
   - correct: false
   - feedback: The first value is printed before `setInterval` is started.

3. `10` down to `5` with one-second gaps
   - correct: false
   - feedback: `current` starts at `from` and increments, so the sequence is ascending.
