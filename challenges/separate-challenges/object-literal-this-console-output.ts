export const objectLiteralThisConsoleOutputChallenge = {
  slug: "object-literal-this-console-output",
  snippetId: "a394cd8b-fb61-424f-9428-5b86bf2cd3f2",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "undefined, then undefined",
      feedback:
        "Not quite. The method form `ref()` receives `user2` as its receiver when called through `user2.ref()`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "undefined, then John",
      feedback:
        "Correct. `ref: this` captures the surrounding function call context, while `ref()` is called as a method of `user2`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "John, then John",
      feedback:
        "Not quite. An object literal does not create `this` for the `ref: this` property value.",
      isCorrect: false,
      order: 3,
    },
  ],
};
