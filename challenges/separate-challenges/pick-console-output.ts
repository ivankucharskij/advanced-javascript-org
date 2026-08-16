export const pickConsoleOutputChallenge = {
  slug: "pick-console-output",
  snippetId: "46122b04-7420-4989-a6e2-861e23eb86e5",
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
