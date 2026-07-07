## 22. composition

slug: composition
topicSlug: composition-vs-inheritance
title: Function Composition Pipeline
description: Composes small functions into a pipeline that builds and displays a date label.
sourceFile: apps/web/content/composition-vs-inheritance.mdx
sourceSection: Composition
sourceSnippet: composition
language: js

```js
const dateFunc = () => new Date();
const textFunc = (date) => date.toDateString();
const labelFunc = (text) => `Today ${text}`;
const showLabelFunc = (label) => console.log(label);

function pipe(...steps) {
  return function runSteps() {
    let result;
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      result = step(result);
    }
    return result;
  };
}

const showDateLabel = pipe(dateFunc, textFunc, labelFunc, showLabelFunc);
showDateLabel();
```

### Challenge 1

slug: composition-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
const label = pipe(() => 2, (n) => n + 3, (n) => `value:${n}`);
console.log(label());
```

Options:

1. `value:5`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `value:2`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
