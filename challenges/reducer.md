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

Options:

1. `[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall", done: true }]`
   - correct: true
   - feedback: Correct. The snippet logs the final state array, including the remaining task and the changed task.

2. `[{ id: 1, text: "Visit Kafka Museum", done: false }, { id: 3, text: "Lennon Wall", done: true }]`
   - correct: false
   - feedback: Not quite. The task with id `1` is deleted before the final state is logged.

3. `[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall pic", done: false }]`
   - correct: false
   - feedback: Not quite. The final `changed` action updates task `3` to `Lennon Wall` with `done: true`.
