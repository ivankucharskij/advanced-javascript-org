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

```js
Promise.customAllSettled([Promise.resolve(1), Promise.reject("x")]).then((result) => console.log(result.map((item) => item.status).join(",")));
```

Options:

1. `fulfilled,rejected`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `rejected,fulfilled`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `fulfilled,fulfilled`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: promise-allsettled-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
Promise.customAllSettled([42]).then((result) => console.log(result[0].value));
```

Options:

1. `42`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `fulfilled`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `undefined`
   - correct: false
   - feedback: This does not match the value printed by console.log.
