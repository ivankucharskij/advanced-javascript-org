export const blockingTheEventLoopWithAWhileLoopConsoleOutputChallenge = {
  slug: "blocking-the-event-loop-with-a-while-loop-console-output",
  snippetId: "16c3f529-d2ca-42f5-bc8b-32c91edbd50b",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "Ran after 0.5 seconds, then Good, looped for 2 seconds",
      feedback:
        "A timer callback cannot interrupt synchronous JavaScript that is already running.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        "Good, looped for 2 seconds, then Ran after ... seconds at roughly 2 seconds",
      feedback:
        "The source explains that the 500 ms timer is delayed until the blocking loop finishes, which is after roughly two seconds.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "Good, looped for 2 seconds only",
      feedback:
        "The loop delays the timer, but it does not cancel the scheduled callback.",
      isCorrect: false,
      order: 3,
    },
  ],
};
