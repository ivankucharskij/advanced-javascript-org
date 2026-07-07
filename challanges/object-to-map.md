## 30. object-to-map

slug: object-to-map
topicSlug: core-concepts
title: Object and Map Conversion
description: Converts between objects, Map entries, arrays of entries, and Map instances.
sourceFile: apps/web/content/core-concepts.mdx
sourceSection: Object and Map Conversion
sourceSnippet: Object to Map
language: js

```js
const prices = Object.fromEntries([
  ["banana", 1],
  ["orange", 2],
  ["meat", 4],
]);

console.log(prices);

const map = new Map();
map.set("banana", 1);
map.set("orange", 2);
map.set("meat", 4);

const arrayLikeMapEntries = map.entries();
const arrayMapEntries = Array.from(arrayLikeMapEntries);

const objectFromMap = Object.fromEntries(arrayMapEntries);
console.log(objectFromMap);

const mapFromObject = new Map(Object.entries(objectFromMap));
console.log(mapFromObject.get("meat"));
```

### Challenge 1

slug: object-to-map-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(objectFromMap.meat);
console.log(mapFromObject.get("meat"));
```

Options:

1. `4, then 4`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `undefined, then 4`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `4, then undefined`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
