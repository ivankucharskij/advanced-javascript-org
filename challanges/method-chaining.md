## 28. method-chaining

slug: method-chaining
topicSlug: core-concepts
title: Method Chaining with this
description: Returns this from object methods to support chained state updates.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Method Chaining with `this`
sourceSnippet: method chaining
language: js

```js
const ladder = {
  step: 0,
  up() {
    this.step++;
    return this;
  },
  down() {
    this.step--;
    return this;
  },
  showStep() {
    console.log(this.step);
    return this;
  },
};

ladder.up().up().down().showStep().down().showStep();
```

### Challenge 1

slug: method-chaining-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
ladder.up().up().down().showStep().down().showStep();
```

Options:

1. `1, then 0`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `2, then 1`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `0, then -1`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
