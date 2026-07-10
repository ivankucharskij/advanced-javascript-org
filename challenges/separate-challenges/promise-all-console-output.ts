export const promiseAllConsoleOutputChallenge = {
  slug: "promise-all-console-output",
  snippetId: "d1b82fd7-ec84-4047-a662-0fd55113a01d",
  topicSlug: "promises",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: 'second, first, third, then ["first", "second", "third"]',
      feedback:
        "Correct. The inner handlers log values as each timer resolves, but the final result array preserves the original input order.",
      isCorrect: true,
      order: 1,
    },
    {
      label: 'first, second, third, then ["first", "second", "third"]',
      feedback:
        'Not quite. The `"second"` promise resolves first because its timer is shorter.',
      isCorrect: false,
      order: 2,
    },
    {
      label: '["first", "second", "third"] only',
      feedback:
        "Not quite. The helper also logs each individual resolved value before logging the final array.",
      isCorrect: false,
      order: 3,
    },
  ],
};
