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

Options:

1. `second, first, third, then ["first", "second", "third"]`
   - correct: true
   - feedback: Correct. The inner handlers log values as each timer resolves, but the final result array preserves the original input order.

2. `first, second, third, then ["first", "second", "third"]`
   - correct: false
   - feedback: Not quite. The `"second"` promise resolves first because its timer is shorter.

3. `["first", "second", "third"] only`
   - correct: false
   - feedback: Not quite. The helper also logs each individual resolved value before logging the final array.

### Challenge 2

slug: promise-all-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
myPromiseAll([]).then((values) => console.log(JSON.stringify(values)));
```

Options:

1. `[], second, first, third, then ["first", "second", "third"]`
   - correct: true
   - feedback: Correct. The empty edge case logs `[]` first, then the reusable snippet's pending timers resolve and print their values.

2. `undefined`
   - correct: false
   - feedback: Not quite. The helper explicitly resolves empty input with an empty array.

3. `[] only`
   - correct: false
   - feedback: Not quite. The reusable snippet is still running, so its delayed promises print after the edge-case `[]`.
