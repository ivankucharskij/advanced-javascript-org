## 72. promise-any

slug: promise-any
topicSlug: promises
title: Implement Promise.any
description: Implements Promise.any by resolving on the first fulfillment or rejecting with AggregateError.
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.any
sourceSnippet: Promise.any
language: js

```js
Promise.customAny = function (promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let remaining = promises.length;

    if (remaining === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((error) => {
          errors[index] = error;
          remaining -= 1;
          if (remaining === 0) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};

const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "quick"));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, "slow"));

const promises = [promise1, promise2, promise3];

Promise.customAny(promises).then((value) => console.log(value));
```

### Challenge 1

slug: promise-any-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
Promise.customAny([Promise.reject("x"), Promise.resolve("ok")]).then(console.log);
```

Options:

1. `ok`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `x`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `AggregateError`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: promise-any-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
Promise.customAny([Promise.reject("a"), Promise.reject("b")]).catch((error) => console.log(error.message));
```

Options:

1. `All promises were rejected`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `a`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `b`
   - correct: false
   - feedback: This does not match the value printed by console.log.
