export const thisConsoleOutputChallenge = {
  slug: "this-console-output",
  snippetId: "7cc44719-cf31-4dda-9fde-b21a239ddd0b",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "[{ age: 20 }, { age: 23 }], then [{ age: 20 }, { age: 23 }]",
      feedback:
        "Correct. The arrow wrapper calls `army.canJoin(user)` as a method, and `customFilter` passes `army` as `thisArg`, so both fixed versions keep the same two users.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "TypeError",
      feedback:
        "Not quite. Passing `army.canJoin` directly would lose `this`, but this snippet logs the fixed calls.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[], then [{ age: 20 }, { age: 23 }]",
      feedback:
        "Not quite. The snippet logs the two fixed approaches, not the broken unbound callback result.",
      isCorrect: false,
      order: 3,
    },
  ],
};
