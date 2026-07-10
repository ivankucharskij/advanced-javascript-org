export const pickConsoleOutputChallenge = {
  slug: "pick-console-output",
  snippetId: "168b9458-41cf-4779-b4c3-bd6bed6b3b50",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'console.log(pick({ a: 1, b: 2, c: 3 }, ["a", "c"]));',
  order: 1,
  options: [
    {
      label: '{"b":2}',
      feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: '{"a":1,"b":2,"c":3}',
      feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
      isCorrect: false,
      order: 2,
    },
    {
      label: '{"a":1,"c":3}',
      feedback:
        'Correct. The snippet returns a new object containing only selected existing keys, so the output is `{"a":1,"c":3}`.',
      isCorrect: true,
      order: 3,
    },
  ],
};
