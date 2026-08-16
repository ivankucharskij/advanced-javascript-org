export const promiseRaceConsoleOutputChallenge = {
  slug: "promise-race-console-output",
  snippetId: "97d063ad-45f6-4cbb-9729-cac74ece1a53",
  topicSlug: "promises",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "1",
      feedback:
        "Correct. The first timer resolves with `1` before the later rejection and the later `3` resolution can settle the race.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "Error: Whoops!",
      feedback:
        "Not quite. The rejection is scheduled later than the promise that resolves with `1`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "3",
      feedback:
        "Not quite. The `3` promise resolves last, so it cannot win the race.",
      isCorrect: false,
      order: 3,
    },
  ],
};
