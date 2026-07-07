## 77. reducer

slug: reducer
topicSlug: random
title: Reducer Pattern with Actions
description: Applies action objects through a reducer to produce a final task state.
sourceFile: apps/web/content/random.mdx
sourceSection: Reducer Pattern with Actions
sourceSnippet: reducer
language: js

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.id) {
          const { type, ...actionNoType } = action;
          return actionNoType;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialState = [];
const actions = [
  { type: "added", id: 1, text: "Visit Kafka Museum" },
  { type: "added", id: 2, text: "Watch a puppet show" },
  { type: "deleted", id: 1 },
  { type: "added", id: 3, text: "Lennon Wall pic" },
  { type: "changed", id: 3, text: "Lennon Wall", done: true },
];
const finalState = actions.reduce(tasksReducer, initialState);
console.log(finalState);
```

### Challenge 1

slug: reducer-console-output
title: Predict the console output
prompt: What does this code print?
code:

```js
console.log(finalState.map((task) => task.text).join(", "));
console.log(finalState[1].done);
```

Options:

1. `Watch a puppet show, Lennon Wall, then true`
   - correct: true
   - feedback: This is the output produced by the snippet plus the challenge code.

2. `Visit Kafka Museum, Lennon Wall, then true`
   - correct: false
   - feedback: This does not match the order or value printed by console.log.

3. `Watch a puppet show, Lennon Wall pic, then false`
   - correct: false
   - feedback: This misses an important behavior shown by the snippet.
