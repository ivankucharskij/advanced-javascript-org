export const blockingInsideAsyncCallbacksConsoleOutputChallenge = {
  slug: "blocking-inside-async-callbacks-console-output",
  snippetId: "0cb1ec07-6fc2-43b9-bf24-090481f2ef81",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label:
        "Start, End, Non-blocking Operation, Long-Running Task Completed, Start Long-Running Task",
      feedback:
        "`longRunningTask()` logs its start before entering the blocking loop, then logs completion after the loop finishes.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        "Start, End, Non-blocking Operation, Start Long-Running Task, then after about 2s Long-Running Task Completed",
      feedback:
        "The source explains that scheduling with `setTimeout` does not make the callback's long synchronous work interruptible. The callback starts after `Start` and `End`, then its loop blocks until completion.",
      isCorrect: true,
      order: 2,
    },
    {
      label:
        "Start, Non-blocking Operation, End, Start Long-Running Task, Long-Running Task Completed",
      feedback:
        "The timer callback does not run before the current script finishes, so `End` appears before `Non-blocking Operation`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
