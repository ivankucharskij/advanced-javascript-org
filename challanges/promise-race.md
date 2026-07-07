## 73. promise-race

slug: promise-race
topicSlug: promises
title: Implement Promise.race
description: Implements Promise.race by settling when the first input promise settles.
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.race
sourceSnippet: Promise.race
language: js

```js
Promise.customRace = function (promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve, reject);
    }
  });
};

Promise.customRace([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Whoops!")), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(console.log);
```

### Challenge 1

slug: promise-race-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
Promise.customRace([Promise.resolve("first"), new Promise((resolve) => setTimeout(resolve, 10, "second"))]).then(console.log);
```

Options:

1. `first`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `second`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
