export const spliceConsoleOutputChallenge = {
  slug: "splice-console-output",
  snippetId: "59b5106c-44a9-4c99-a2e4-d9804ee3374e",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const values = [1, 2, 3, 4];\r\nconsole.log(values.customSplice(1, 2, "a", "b"));\r\nconsole.log(values);',
  order: 1,
  options: [
    {
      label: '[2,3], then [1,4,"a","b"]',
      feedback: 'Not quite. The output is `[2,3], then [1,"a","b",4]`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: '[2,3], then [1,"a","b",4]',
      feedback:
        'Correct. The snippet normalizes splice arguments, removes a segment, inserts new items, and returns deleted values, so the output is `[2,3], then [1,"a","b",4]`.',
      isCorrect: true,
      order: 2,
    },
    {
      label: '["a","b"], then [1,2,3,4]',
      feedback: 'Not quite. The output is `[2,3], then [1,"a","b",4]`.',
      isCorrect: false,
      order: 3,
    },
  ],
};
