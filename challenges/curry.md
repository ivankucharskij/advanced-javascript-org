## 63. curry

slug: curry
topicSlug: lodash
title: Implement curry
description: Transforms a fixed-arity function into a chain of partially applied calls.
sourceFile: apps/web/content/lodash.mdx
sourceSection: curry
sourceSnippet: curry
language: js

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return (...nextArgs) => curried(...args, ...nextArgs);
    }
  };
}
```

### Challenge 1

slug: curry-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const add = (a, b, c) => a + b + c;
console.log(curry(add)(1)(2)(3));
```

Options:

1. `6`
   - correct: true
   - feedback: Correct. The snippet transforms a fixed-arity function into a chain of partially applied calls, so the output is `6`.

2. `123`
   - correct: false
   - feedback: Not quite. The output is `6`.

3. `3`
   - correct: false
   - feedback: Not quite. The output is `6`.
