export const reducerConsoleOutputChallenge = {
  slug: "reducer-console-output",
  snippetId: "2fad25c6-21b8-4545-9a6c-0163b0233eb7",
  topicSlug: "random",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label:
        '[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall pic", done: false }]',
      feedback:
        "Not quite. The final `changed` action updates task `3` to `Lennon Wall` with `done: true`.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        '[{ id: 1, text: "Visit Kafka Museum", done: false }, { id: 3, text: "Lennon Wall", done: true }]',
      feedback:
        "Not quite. The task with id `1` is deleted before the final state is logged.",
      isCorrect: false,
      order: 2,
    },
    {
      label:
        '[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall", done: true }]',
      feedback:
        "Correct. The snippet logs the final state array, including the remaining task and the changed task.",
      isCorrect: true,
      order: 3,
    },
  ],
};
