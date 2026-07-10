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
prompt: What does the snippet print?
code: null

Options:

1. `0, 1, 2, 3` after about 1 second
   - correct: true
   - feedback: The source explains that `let` gives each iteration its own block-scoped `i`. All callbacks run after the one-second timer delay.

2. `4, 4, 4, 4` after about 1 second
   - correct: false
   - feedback: That would be the classic shared-variable result, but this snippet uses `let`, so each callback keeps a distinct value.

3. `0, 1, 2, 3` immediately
   - correct: false
   - feedback: The values are distinct, but they are printed by `setTimeout` callbacks after about one second.
