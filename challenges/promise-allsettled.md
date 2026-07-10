## 71. promise-allsettled

slug: promise-allsettled
topicSlug: promises
title: Implement Promise.allSettled
description: Implements Promise.allSettled by converting each input into a status object.
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.allSettled
sourceSnippet: Promise.allSettled
language: js

```js
const rejectHandler = (reason) => ({ status: "rejected", reason });
const resolveHandler = (value) => ({ status: "fulfilled", value });

Promise.customAllSettled = function (promises) {
  const convertedPromises = promises.map((p) =>
    Promise.resolve(p).then(resolveHandler, rejectHandler),
  );

  return Promise.all(convertedPromises);
};

Promise.customAllSettled([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Whoops!")), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then(console.info)
  .catch(console.error);
```

### Challenge 1

slug: promise-allsettled-console-output
title: Predict the console output
prompt: What does this code print?
code:

Options:

1. `fulfilled 1, rejected Error("Whoops!"), fulfilled 3`
   - correct: true
   - feedback: Correct. The reusable snippet logs the full allSettled result array after all three delayed inputs settle.

2. `rejected,fulfilled`
   - correct: false
   - feedback: Not quite. `allSettled` preserves the original input order and includes three result objects.

3. `fulfilled,rejected`
   - correct: false
   - feedback: Not quite. That summarizes part of the statuses, but the snippet logs the full result objects including values and the error.

### Challenge 2

slug: promise-allsettled-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
Promise.customAllSettled([42]).then((result) => console.log(result[0].value));
```

Options:

1. `42, then fulfilled 1, rejected Error("Whoops!"), fulfilled 3`
   - correct: true
   - feedback: Correct. The edge case logs `42` first, then the reusable snippet logs its delayed allSettled result array.

2. `fulfilled`
   - correct: false
   - feedback: Not quite. The challenge logs the value, and the reusable snippet still logs its own result later.

3. `42 only`
   - correct: false
   - feedback: Not quite. The reusable snippet's delayed allSettled call also prints after the edge-case value.
