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

```js
console.log(result.map((item) => item.name).join(", "));
```

Options:

1. `Stephen Stills, Neil Young`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `Neil Young, Stephen Stills`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `Richie Furay, Stephen Stills`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
