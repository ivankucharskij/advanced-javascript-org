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
prompt: What does this code print?
code:

```js
console.log("for and while can produce the same iteration output");
```

Options:

1. `for and while can produce the same iteration output`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `for runs asynchronously`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `while skips the first item`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
