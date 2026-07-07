## 39. lexical-environment-scope-broken

slug: lexical-environment-scope-broken
topicSlug: core-concepts
title: Broken Closure Scope in Loops
description: Shows a closure bug caused by referencing a variable outside its lexical scope.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Shooters: Closures & Lexical Scope
sourceSnippet: lexical environment(scope)
language: js

```js
function makeArmy() {
  const shooters = [];

  let i = 0;
  while (i < 10) {
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

slug: lexical-environment-scope-broken-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
try { console.log(value); } catch (error) { console.log(error.name); }
```

Options:

1. `ReferenceError`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `undefined`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `TypeError`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
