export const promiseAnyConsoleOutputChallenge = {
  slug: "promise-any-console-output",
  snippetId: "e009feda-50da-4ec8-bcec-da293cb37c50",
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
