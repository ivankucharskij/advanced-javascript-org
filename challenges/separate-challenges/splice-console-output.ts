export const spliceConsoleOutputChallenge = {
  slug: "splice-console-output",
  snippetId: "c48d1f14-99b5-438e-b1bd-fb798a927116",
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
