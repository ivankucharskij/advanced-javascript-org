## 76. innerjoin

slug: innerjoin
topicSlug: random
title: Implement innerJoin
description: Filters records by matching each record against a list of ids with a predicate.
sourceFile: apps/web/content/random.mdx
sourceSection: innerJoin
sourceSnippet: innerJoin
language: js

```js
function innerJoin(predicate, records, ids) {
  return records.filter((record) => ids.some((id) => predicate(record, id)));
}

const result = innerJoin(
  (record, id) => record.id === id,
  [
    { id: 824, name: "Richie Furay" },
    { id: 956, name: "Dewey Martin" },
    { id: 313, name: "Bruce Palmer" },
    { id: 456, name: "Stephen Stills" },
    { id: 177, name: "Neil Young" },
  ],
  [177, 456, 999],
);

console.log(result);
```

### Challenge 1

slug: innerjoin-console-output
title: Predict the console output
prompt: What does this code print?
code: 

Options:

1. `[{ id: 456, name: "Stephen Stills" }, { id: 177, name: "Neil Young" }]`
   - correct: true
   - feedback: Correct. The snippet logs the filtered records themselves, preserving record order from the original array.

2. `[{ id: 177, name: "Neil Young" }, { id: 456, name: "Stephen Stills" }]`
   - correct: false
   - feedback: Not quite. `filter` keeps the original record order, so Stephen Stills appears before Neil Young.

3. `Stephen Stills, Neil Young`
   - correct: false
   - feedback: Not quite. The snippet logs the array of matching record objects, not just the joined names.
