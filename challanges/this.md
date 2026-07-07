## 24. this

slug: this
topicSlug: core-concepts
title: thisArg in Array Callbacks
description: Compares callback invocation with and without an explicit thisArg binding.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Understanding this
sourceSnippet: this
language: js

```js
Array.prototype.customFilter = function (callback, thisArg) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};

Array.prototype.customFilterNoThis = function (callback) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};

const army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  },
};

const users = [{ age: 16 }, { age: 20 }, { age: 23 }, { age: 30 }];

const soldiers1 = users.customFilterNoThis(army.canJoin);
const soldiers2 = users.customFilterNoThis((user) => army.canJoin(user));
const soldiers3 = users.customFilter(army.canJoin, army);

console.log(soldiers1, soldiers2, soldiers3)
```

### Challenge 1

slug: this-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(soldiers2.length);
console.log(soldiers3.length);
```

Options:

1. `2, then 2`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `0, then 2`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `2, then 0`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.

### Challenge 2

slug: this-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
console.log(soldiers1.length);
```

Options:

1. `0`
   - correct: true
   - feedback: This output follows the edge-case behavior in the snippet.

2. `2`
   - correct: false
   - feedback: This misses how the snippet handles this edge case.

3. `4`
   - correct: false
   - feedback: This does not match the value printed by console.log.
