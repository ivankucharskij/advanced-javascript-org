## 12. join

slug: join
topicSlug: array-methods
title: Implement Array.prototype.join
description: Concatenates array values into a string with a configurable separator.
sourceFile: apps/web/content/array-methods.mdx
sourceSection: Array.join
sourceSnippet: join
language: js

```js
Array.prototype.customJoin = function (separator = ",") {
  let result = "";

  for (let i = 0; i < this.length; i++) {
    if (i > 0) {
      result += separator;
    }

    result += this[i];
  }

  return result;
};
```

### Challenge 1

slug: join-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(["a", "b", "c"].customJoin("-"));
```

Options:

1. `a-b-c`
   - correct: true
   - feedback: Correct. The snippet concatenates array values into a string with a configurable separator, so the output is `a-b-c`.

2. `a,b,c`
   - correct: false
   - feedback: Not quite. The output is `a-b-c`.

3. `abc`
   - correct: false
   - feedback: Not quite. The output is `a-b-c`.
