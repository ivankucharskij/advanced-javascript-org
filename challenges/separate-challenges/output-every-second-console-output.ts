export const outputEverySecondConsoleOutputChallenge = {
  slug: "output-every-second-console-output",
  snippetId: "e1c01461-e830-4790-9904-57521d714793",
  topicSlug: "debounce-throttle",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "10 down to 5 with one-second gaps",
      feedback:
        "`current` starts at `from` and increments, so the sequence is ascending.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "5 through 10, all after one second",
      feedback: "The first value is printed before `setInterval` is started.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "5 immediately, then 6 through 10 with one-second gaps",
      feedback:
        "The source says the first call to `go()` prints `5` immediately, then `setInterval` repeats until the range reaches `10`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
