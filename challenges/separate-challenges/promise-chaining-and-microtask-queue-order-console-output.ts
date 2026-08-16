export const promiseChainingAndMicrotaskQueueOrderConsoleOutputChallenge = {
  slug: "promise-chaining-and-microtask-queue-order-console-output",
  snippetId: "9e2e59e4-d5d6-40d5-a428-5c58df77c3bf",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "3, 4, 1, 2",
      feedback:
        "The first chain is registered first, so its first handler prints before the second chain's first handler.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "1, 2, 3, 4",
      feedback:
        "`promise1`'s second handler is queued only after its first handler runs, so `promise2`'s first handler runs before it.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "1, 3, 2, 4",
      feedback:
        "The source explains that each chained `.then()` schedules its next link only after its own handler runs, so the two chains interleave.",
      isCorrect: true,
      order: 3,
    },
  ],
};
