## 26. object-method-this-fix

slug: object-method-this-fix
topicSlug: core-concepts
title: Object Method Receiver with this
description: Uses this inside an object method so the method works after reassignment.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Methods and `this`
sourceSnippet: object method this fix
language: js

```js
let user = {
  name: "John",
  sayHi() {
    console.log(this.name);
  },
};

const admin = user;
user = null;

admin.sayHi();
```

### Challenge 1

slug: object-method-this-fix-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
admin.sayHi();
```

Options:

1. `John`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `TypeError`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
