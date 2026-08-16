export const bindConsoleOutputChallenge = {
  slug: "bind-console-output",
  snippetId: "b551abf5-45fa-477f-a000-87d95c2c4a8f",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "Hello, John!, then Hello, John!",
      feedback:
        "The timer callback receives the unbound method, not a wrapper or `bind(user)` result.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "Hello, John!, then Hello, undefined!",
      feedback:
        "The source explains that passing `user.sayHi` to `setTimeout` removes the object before the dot, so the method loses its receiver.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "Hello, undefined!, then Hello, John!",
      feedback:
        "`user.sayHi()` is called as a method first, so it has `user` as its receiver.",
      isCorrect: false,
      order: 3,
    },
  ],
};
