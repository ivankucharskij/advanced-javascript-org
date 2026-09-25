export const differencebyConsoleOutputChallenge = {
  slug: "differenceby-console-output",
  snippetId: "b87fb323-153c-4204-b7d7-07139b2a9f41",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const left = [{ id: 1 }, { id: 2 }];\r\nconst right = [{ id: 2 }, { id: 3 }];\r\nconsole.log(differenceBy(left, right, "id"));',
  order: 1,
  options: [
    {
      label: '[[{"id":2}],[]]',
      feedback: 'Not quite. The output is `[[{"id":1}],[{"id":3}]]`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: '[[{"id":1}],[{"id":3}]]',
      feedback:
        'Correct. The snippet computes object differences by comparing a selected property value, so the output is `[[{"id":1}],[{"id":3}]]`.',
      isCorrect: true,
      order: 2,
    },
    {
      label: '[{"id":1},{"id":3}]',
      feedback: 'Not quite. The output is `[[{"id":1}],[{"id":3}]]`.',
      isCorrect: false,
      order: 3,
    },
  ],
};
