## 39. lexical-environment-scope-broken

slug: lexical-environment-scope-broken
topicSlug: core-concepts
title: Broken Closure Scope in Loops
description: Shows a closure bug where every returned function reads the same final loop variable.
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
      return i;
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

slug: lexical-environment-scope-broken-console-output
title: Predict the console output
prompt: What does this code print?
code:

Options:

1. `10, 10, 10`
   - correct: true
   - feedback: Correct. Every shooter closes over the same `i` variable, and by the time any shooter runs the loop has finished with `i === 10`.

2. `0, 1, 5`
   - correct: false
   - feedback: Not quite. That would require each shooter to close over a separate per-iteration value.

3. `ReferenceError`
   - correct: false
   - feedback: Not quite. `i` is in scope for the returned functions; the bug is that all of them read the same final value.
