export const promiseAllAndTheEventLoopConsoleOutputChallenge = {
  slug: "promise-all-and-the-event-loop-console-output",
  snippetId: "804cdeb7-cf98-45a6-a838-ce1fc8166613",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: '{ values: [3, "foo", 42] } before { values3: [3, 42] }',
      feedback:
        '`values3` depends only on an already resolved promise and a plain value, so it resolves before the Promise.all that waits for `"foo"`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: "the queue is now empty before the initial { p3 } and { p4 } logs",
      feedback:
        "The initial `{ p3 }` and `{ p4 }` logs are part of the current script, so they happen before the timer callback.",
      isCorrect: false,
      order: 2,
    },
    {
      label:
        "{ p3: Promise { [] } }, { p4: Promise { <pending> } }, { values3: [3, 42] }, timer logs, then delayed values logs",
      feedback:
        "The source notes that non-promise values are treated as resolved, but evaluation still runs asynchronously. The Promise.all containing the 1000 ms timer resolves after that timer.",
      isCorrect: true,
      order: 3,
    },
  ],
};
