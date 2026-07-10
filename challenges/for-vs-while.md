## 29. for-vs-while

slug: for-vs-while
topicSlug: core-concepts
title: Pre-Increment vs Post-Increment in Loops
description: Compares pre-increment and post-increment behavior in loops.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Loop Behavior: Pre/Post Increment
sourceSnippet: for vs while
language: js

```js
let i = 0;
while (++i < 3) console.log(i);

let i2 = 0;
while (i2++ < 3) console.log(i2);

for (let i = 0; i < 3; i++) console.log(i);

for (let i = 0; i < 3; ++i) console.log(i);
```

### Challenge 1

slug: for-vs-while-console-output
title: Predict the console output
prompt: What does the snippet print?
code: null

Options:

1. `1, 2`, then `1, 2, 3`, then `0, 1, 2`, then `0, 1, 2`
   - correct: true
   - feedback: `++i` increments before the while condition is checked; `i++` checks the old value first. In both `for` loops, the increment runs after the loop body, so `i++` and `++i` produce the same output there.

2. `1, 2`, then `0, 1, 2`, then `0, 1, 2`, then `1, 2, 3`
   - correct: false
   - feedback: The second `while` loop with `i2++` prints `1, 2, 3` before either `for` loop runs.

3. `0, 1, 2` four times
   - correct: false
   - feedback: The two `while` loops differ because their increment happens inside the condition expression.
