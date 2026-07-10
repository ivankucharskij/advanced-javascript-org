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
prompt: What does the snippet print?
code: null

Options:

1. `Hello, John!`, then `Hello, undefined!`
   - correct: true
   - feedback: The source explains that passing `user.sayHi` to `setTimeout` removes the object before the dot, so the method loses its receiver.

2. `Hello, John!`, then `Hello, John!`
   - correct: false
   - feedback: The timer callback receives the unbound method, not a wrapper or `bind(user)` result.

3. `Hello, undefined!`, then `Hello, John!`
   - correct: false
   - feedback: `user.sayHi()` is called as a method first, so it has `user` as its receiver.
