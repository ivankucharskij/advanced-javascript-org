export const outputEverySecond2ConsoleOutputChallenge = {
  slug: "output-every-second-2-console-output",
  snippetId: "736b0114-4b16-4de2-b52d-9a2d0c4095d4",
  topicSlug: "debounce-throttle",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "5 through 10, all after one second",
      feedback:
        "The first value is printed by the initial `go()` call before any timeout is scheduled.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "10 down to 5 with one-second gaps",
      feedback:
        "The function increments `current`, so it prints the range from `5` to `10`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "5 immediately, then 6 through 10 with one-second gaps",
      feedback:
        "The source explains that recursive `setTimeout` schedules the next run after the current run finishes. Here the first `go()` call prints `5` immediately.",
      isCorrect: true,
      order: 3,
    },
  ],
};
