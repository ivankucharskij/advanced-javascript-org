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
   - feedback: Correct. The snippet builds a className string from strings, arrays, and conditional object keys, so the output is `btn active primary`.

2. `btn active hidden primary`
   - correct: false
   - feedback: Not quite. The output is `btn active primary`.

3. `btn primary active false`
   - correct: false
   - feedback: Not quite. The output is `btn active primary`.

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
   - feedback: Correct. This follows the same implementation, so the output is `a b c e`.

2. `a b c d e`
   - correct: false
   - feedback: Not quite. This edge case outputs `a b c e`.

3. `a,b,c,e`
   - correct: false
   - feedback: Not quite. This edge case outputs `a b c e`.
