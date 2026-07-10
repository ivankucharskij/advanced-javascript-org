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

const date = dateFunc();
const text = textFunc(date);
const label = labelFunc(text);
showLabelFunc(label);

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
prompt: What does the snippet print?
code: null

Options:

1. `Two matching strings like "Today Tue Jul 07 2026"`
   - correct: true
   - feedback: Correct. The direct function calls log the date label once, then the composed `pipe` version builds and logs the same kind of label again.

2. `The raw Date object`
   - correct: false
   - feedback: Not quite. The date is converted with `toDateString()` before it is logged.

3. `One string like "Today Tue Jul 07 2026"`
   - correct: false
   - feedback: Not quite. The source logs once through the direct steps and once through the composed pipeline.
