## 27. object-literal-this

slug: object-literal-this
topicSlug: core-concepts
title: Object Literals and this Binding
description: Contrasts storing this during object creation with returning this from a method.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object Literals and `this`
sourceSnippet: object literal this
language: js

```js
function makeUser() {
  return {
    name: "John",
    ref: this,
  };
}

const user = makeUser();
console.log(user.ref?.name); 

function makeUserWithMethod() {
  return {
    name: "John",
    ref() {
      return this;
    },
  };
}

const user2 = makeUserWithMethod();
console.log(user2.ref().name);
```

### Challenge 1

slug: object-literal-this-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(user.ref?.name);
console.log(user2.ref().name);
```

Options:

1. `undefined, then John`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `John, then John`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined, then undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
