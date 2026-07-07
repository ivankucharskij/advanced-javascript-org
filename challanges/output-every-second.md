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
prompt: What does this code print?
code:

```js
console.log("1, 2, 3 with one-second gaps");
```

Options:

1. `1, 2, 3 with one-second gaps`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `1, 1, 1 with one-second gaps`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `3, 2, 1 immediately`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
