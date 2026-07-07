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
prompt: What does this code print?
code:

```js
console.log("1, 2, 3 with one-second gaps");
```

Options:

1. `1, 2, 3 with one-second gaps`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `0, 1, 2 with one-second gaps`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `1, 2, 3 immediately`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
