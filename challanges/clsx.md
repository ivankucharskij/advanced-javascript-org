## 74. clsx

slug: clsx
topicSlug: random
title: Implement clsx
description: Builds a className string from strings, arrays, and conditional object keys.
sourceFile: apps/web/content/random.mdx
sourceSection: clsx
sourceSnippet: clsx
language: js

```js
function clsx(...args) {
  const classes = [];

  for (const arg of args) {
    // Skip the current iteration if the argument is falsy
    if (!arg) continue;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(clsx(...arg)); // Recursively process arrays
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key); // Push key if value is truthy
        }
      }
    }
  }

  return classes.join(" "); // Join classes with a space
}
```

### Challenge 1

slug: clsx-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(clsx("btn", ["active", false], { hidden: false, primary: true }));
```

Options:

1. `btn active primary`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `btn active hidden primary`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `btn primary active false`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: clsx-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(clsx(["a", ["b", { c: true, d: false }]], null, "e"));
```

Options:

1. `a b c e`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `a b c d e`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `a,b,c,e`
   - correct: false
   - feedback: This does not match the value printed by console.log.
