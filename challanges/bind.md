## 31. bind

slug: bind
topicSlug: core-concepts
title: Lost Method Receiver in setTimeout
description: Demonstrates how passing a method loses its receiver in an asynchronous callback.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: bind
sourceSnippet: bind
language: js

```js
const user = {
  firstName: "John",
  sayHi() {
    console.log(`Hello, ${this.firstName}!`);
  },
};

user.sayHi();
setTimeout(user.sayHi, 0);
```

### Challenge 1

slug: bind-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(obj.regularMethod.call(anotherObj));
console.log(obj.regularMethod.bind(anotherObj)());
```

Options:

1. `50, then 50`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `25, then 50`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `50, then 25`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
