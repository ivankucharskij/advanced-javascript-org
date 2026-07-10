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

Options:

1. `1`
   - correct: true
   - feedback: Correct. The first timer resolves with `1` before the later rejection and the later `3` resolution can settle the race.

2. `Error: Whoops!`
   - correct: false
   - feedback: Not quite. The rejection is scheduled later than the promise that resolves with `1`.

3. `3`
   - correct: false
   - feedback: Not quite. The `3` promise resolves last, so it cannot win the race.
