## 37. handling-errors-async

slug: handling-errors-async
topicSlug: core-concepts
title: Asynchronous Errors Outside Promise Chains
description: Shows that an error thrown inside a later timer is not caught by the original promise chain.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Synchronous vs Asynchronous Errors in Promises
sourceSnippet: handling errors
language: js

```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(console.error);
```

### Challenge 1

slug: handling-errors-async-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
Promise.reject(new Error("fail")).catch((error) => console.log(error.message));
```

Options:

1. `fail`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `Error`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
