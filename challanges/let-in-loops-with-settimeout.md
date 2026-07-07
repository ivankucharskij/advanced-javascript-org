## 48. let-in-loops-with-settimeout

slug: let-in-loops-with-settimeout
topicSlug: event-loop
title: let in Loops with setTimeout
description: Uses block-scoped loop variables so delayed callbacks log distinct values.
sourceFile: apps/web/content/event-loop.mdx
sourceSection: `let` in Loops with `setTimeout`
sourceSnippet: -
language: js

```js
for (let i = 0; i < 4; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

### Challenge 1

slug: let-in-loops-with-settimeout-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log("0, 1, 2");
```

Options:

1. `0, 1, 2`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `3, 3, 3`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `0, 0, 0`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
