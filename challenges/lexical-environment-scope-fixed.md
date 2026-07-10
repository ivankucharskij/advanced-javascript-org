## 38. lexical-environment-scope-fixed

slug: lexical-environment-scope-fixed
topicSlug: core-concepts
title: Closure Capture in Loops
description: Captures a loop variable per iteration so each closure returns the expected value.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Shooters: Closures & Lexical Scope
sourceSnippet: lexical environment(scope)
language: js

```js
function makeArmy() {
  const shooters = [];

  let i = 0;
  while (i < 10) {
    let j = i;
    const shooter = function () {
      return j;
    };
    shooters.push(shooter);
    i++;
  }

  return shooters;
}

const army = makeArmy();

console.log(army[0]());
console.log(army[1]());
console.log(army[5]());
```

### Challenge 1

slug: lexical-environment-scope-fixed-console-output
title: Predict the console output
prompt: What does this code print?
code:

Options:

1. `0, 1, 5`
   - correct: true
   - feedback: Correct. Each loop iteration creates a new block-scoped `j`, so each shooter remembers the value from the iteration that created it.

2. `10, 10, 10`
   - correct: false
   - feedback: Not quite. That is the broken closure behavior when every shooter reads the same changing loop variable.

3. `ReferenceError`
   - correct: false
   - feedback: Not quite. `j` exists in the lexical environment captured by each returned shooter function.
