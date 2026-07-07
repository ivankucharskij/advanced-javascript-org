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
```

### Challenge 1

slug: lexical-environment-scope-fixed-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(typeof outer);
```

Options:

1. `function`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `undefined`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `object`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
