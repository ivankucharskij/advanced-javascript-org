## 35. function-stack

slug: function-stack
topicSlug: core-concepts
title: Recursive Call Stack Order
description: Shows recursive call-stack order by logging before and after nested calls.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Function Stack
sourceSnippet: function stack
language: js

```js
function foo(i) {
  if (i < 0) {
    return;
  }
  console.log(`begin: ${i}`);
  foo(i - 1);
  console.log(`end: ${i}`);
}
```

### Challenge 1

slug: function-stack-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
foo(2);
```

Options:

1. `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`
   - correct: true
   - feedback: Correct. The snippet shows recursive call-stack order by logging before and after nested calls, so the output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.

2. `begin: 2, end: 2, begin: 1, end: 1, begin: 0, end: 0`
   - correct: false
   - feedback: Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.

3. `begin: 0, begin: 1, begin: 2, end: 2, end: 1, end: 0`
   - correct: false
   - feedback: Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.
