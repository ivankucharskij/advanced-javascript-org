export const keybyConsoleOutputChallenge = {
  slug: "keyby-console-output",
  snippetId: "56eeb472-b044-4ebe-b836-41b6efeefb98",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const users = [{ id: "a", name: "Ada" }, { id: "b", name: "Brendan" }];\r\nconsole.log(keyBy(users, "id").b.name);',
  order: 1,
  options: [
    {
      label: "Brendan",
      feedback:
        "Correct. The snippet indexes collection items by a property name or iteratee result, so the output is `Brendan`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: '{ id: "b", name: "Brendan" }',
      feedback:
        "Not quite. The code reads `.name`, so it logs the name string rather than the whole record.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "Ada",
      feedback:
        "Not quite. Key `b` points to the second user, not the first one.",
      isCorrect: false,
      order: 3,
    },
  ],
};
