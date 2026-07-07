## 36. handling-errors-sync

slug: handling-errors-sync
topicSlug: core-concepts
title: Synchronous Errors in Promise Executors
description: Catches a synchronous throw inside the Promise executor with catch.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Synchronous vs Asynchronous Errors in Promises
sourceSnippet: handling errors
language: js

```js
new Promise(function (resolve, reject) {
  throw new Error("Whoops!");
}).catch((e) => console.error(e.message));
```

### Challenge 1

slug: handling-errors-sync-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
try { throw new Error("fail"); } catch (error) { console.log(error.message); }
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
