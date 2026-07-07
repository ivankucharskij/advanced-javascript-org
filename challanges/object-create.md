## 33. object-create

slug: object-create
topicSlug: core-concepts
title: Prototype Inheritance with Object.create
description: Creates an object with a prototype method and reads instance-specific properties.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Inheriting Methods with `Object.create`
sourceSnippet: Object.create
language: js

```js
const vehicle = {
  getInfo() {
    console.log(`${this.model} was made in ${this.year}`);
  },
};

const myCar = Object.create(vehicle);
myCar.model = "BMW";
myCar.year = 2010;
```

### Challenge 1

slug: object-create-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
myCar.getInfo();
```

Options:

1. `BMW was made in 2010`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `undefined was made in undefined`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `vehicle was made in 2010`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
