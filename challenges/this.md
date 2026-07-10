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
"use strict";

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

const soldiers2 = users.customFilterNoThis((user) => army.canJoin(user));
const soldiers3 = users.customFilter(army.canJoin, army);

console.log(soldiers2);
console.log(soldiers3);
```

### Challenge 1

slug: this-console-output
title: Predict the console output
prompt: What does this code print?
code:

Options:

1. `[{ age: 20 }, { age: 23 }], then [{ age: 20 }, { age: 23 }]`
   - correct: true
   - feedback: Correct. The arrow wrapper calls `army.canJoin(user)` as a method, and `customFilter` passes `army` as `thisArg`, so both fixed versions keep the same two users.

2. `[], then [{ age: 20 }, { age: 23 }]`
   - correct: false
   - feedback: Not quite. The snippet logs the two fixed approaches, not the broken unbound callback result.

3. `TypeError`
   - correct: false
   - feedback: Not quite. Passing `army.canJoin` directly would lose `this`, but this snippet logs the fixed calls.

### Challenge 2

slug: this-edge-console-output
title: Predict the edge-case console output
prompt: What does this edge case print?
code:

```js
try {
  users.customFilterNoThis(army.canJoin);
} catch (error) {
  console.log(error.name);
}
```

Options:

1. `[{ age: 20 }, { age: 23 }], [{ age: 20 }, { age: 23 }], then TypeError`
   - correct: true
   - feedback: Correct. The reusable snippet logs the two fixed arrays first, then the edge case passes the method without a receiver and catches the resulting `TypeError`.

2. `TypeError only`
   - correct: false
   - feedback: Not quite. The reusable snippet logs the two fixed arrays before the edge-case code runs.

3. `[], then TypeError`
   - correct: false
   - feedback: Not quite. The fixed calls both keep the two users whose ages are in range.
