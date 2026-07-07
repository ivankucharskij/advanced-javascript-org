## 25. object-method-this

slug: object-method-this
topicSlug: core-concepts
title: Broken Object Method Receiver
description: Shows why closing over an object variable can break after reassignment.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Methods and `this`
sourceSnippet: object method this
language: js

```js
let user = {
  name: "John",
  sayHi() {
    console.log(user.name);
  },
};

const admin = user;
user = null;

admin.sayHi();
```

### Challenge 1

slug: object-method-this-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
try { admin.sayHi(); } catch (error) { console.log(error.name); }
```

Options:

1. `TypeError`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `John`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
