export const requestanimationframeAndTaskOrderingConsoleOutputChallenge = {
  slug: "requestanimationframe-and-task-ordering-console-output",
  snippetId: "8b065588-d7bd-4e50-a03d-835b41fd2052",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "1, 6, 7, 4, 2, 3, 5",
      feedback:
        "`requestAnimationFrame` does not run as soon as it is registered; it waits for the frame phase.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "1, 6, 4, 2, 3, 5, 7",
      feedback:
        "The source states that promise microtasks run before macrotasks, and `requestAnimationFrame` is queued before the next paint after the other queues are cleared.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "1, 2, 3, 4, 5, 6, 7",
      feedback:
        "The synchronous `6` prints before any queued callback, and the promise callback `4` runs before the timer callback `2`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
