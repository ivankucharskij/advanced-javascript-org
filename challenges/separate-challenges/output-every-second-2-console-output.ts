export const outputEverySecond2ConsoleOutputChallenge = {
  slug: "output-every-second-2-console-output",
  snippetId: "94896dfb-4957-4a4f-a4ab-6bc4da15deca",
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
