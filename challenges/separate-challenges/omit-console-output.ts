export const omitConsoleOutputChallenge = {
  slug: "omit-console-output",
  snippetId: "4dd5d6aa-a36d-4ee1-b58a-6c6e1d4b0e8c",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'console.log(omit({ a: 1, b: 2, c: 3 }, ["b"]));',
  order: 1,
  options: [
    {
      label: '{"b":2}',
      feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: '{"a":1,"c":3}',
      feedback:
        'Correct. The snippet returns a shallow object copy with one or more keys removed, so the output is `{"a":1,"c":3}`.',
      isCorrect: true,
      order: 2,
    },
    {
      label: '{"a":1,"b":2,"c":3}',
      feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
      isCorrect: false,
      order: 3,
    },
  ],
};
