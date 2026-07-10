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

Options:

1. `quick`
   - correct: true
   - feedback: Correct. The rejection is ignored because Promise.any waits for the first fulfillment, and the `"quick"` promise fulfills before `"slow"`.

2. `slow`
   - correct: false
   - feedback: Not quite. `"quick"` settles first, so `"slow"` does not win.

3. `AggregateError`
   - correct: false
   - feedback: AggregateError is only used when every input rejects. Here the `"quick"` promise fulfills.

### Challenge 2

slug: promise-any-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
Promise.customAny([Promise.reject("a"), Promise.reject("b")]).catch((error) => console.log(error.message));
```

Options:

1. `All promises were rejected, then quick`
   - correct: true
   - feedback: Correct. The edge-case rejection is handled before the reusable snippet's delayed `"quick"` fulfillment prints.

2. `a`
   - correct: false
   - feedback: Promise.any collects all rejection reasons instead of printing the first one directly.

3. `All promises were rejected`
   - correct: false
   - feedback: Not quite. That message prints, but the reusable snippet later prints `quick` too.
