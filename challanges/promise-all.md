## 70. promise-all

slug: promise-all
topicSlug: promises
title: Implement Promise.all
description: Implements Promise.all by preserving result order and rejecting on the first failure.
sourceFile: apps/web/content/promises.mdx
sourceSection: Promise.all
sourceSnippet: Promise.all
language: js

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let completedPromises = 0;

    for (let index = 0; index < promises.length; index++) {
      Promise.resolve(promises[index])
        .then((value) => {
          results[index] = value;
          console.log(value);
          completedPromises += 1;
          if (completedPromises === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    }

    if (promises.length === 0) {
      resolve([]);
    }
  });
}

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, "first");
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "second");
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, "third");
});

myPromiseAll([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
```

### Challenge 1

slug: promise-all-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
myPromiseAll([Promise.resolve("a"), Promise.resolve("b")]).then((values) => console.log(values.join("-")));
```

Options:

1. `a, b, then a-b`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `a-b only`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `b, a, then b-a`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: promise-all-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
myPromiseAll([]).then((values) => console.log(JSON.stringify(values)));
```

Options:

1. `[]`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `undefined`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `[null]`
   - correct: false
   - feedback: This does not match the value printed by console.log.
