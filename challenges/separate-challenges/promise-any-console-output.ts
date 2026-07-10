export const promiseAnyConsoleOutputChallenge = {
  slug: "promise-any-console-output",
  snippetId: "a93d31e7-9476-4827-bbd8-86032b796a37",
  topicSlug: "promises",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "quick",
      feedback:
        'Correct. The rejection is ignored because Promise.any waits for the first fulfillment, and the `"quick"` promise fulfills before `"slow"`.',
      isCorrect: true,
      order: 1,
    },
    {
      label: "AggregateError",
      feedback:
        'AggregateError is only used when every input rejects. Here the `"quick"` promise fulfills.',
      isCorrect: false,
      order: 2,
    },
    {
      label: "slow",
      feedback: 'Not quite. `"quick"` settles first, so `"slow"` does not win.',
      isCorrect: false,
      order: 3,
    },
  ],
};
