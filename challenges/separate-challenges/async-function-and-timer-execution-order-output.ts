export const asyncFunctionAndTimerExecutionOrderOutputChallenge = {
  slug: "async-function-and-timer-execution-order-output",
  snippetId: "e05d4397-a43f-4061-b48b-d800c28ce6e2",
  topicSlug: "event-loop",
  title: "Predict async function and timer output order",
  prompt: "What is the console output order?",
  code: null,
  order: 1,
  options: [
    {
      label: "run async, timeout, run timeout, script",
      feedback:
        "Zero-delay timers are still delayed to later macrotasks. The awaited async continuation runs first as a microtask, so `script` prints before `timeout` and `run timeout`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "timeout, run async, script, run timeout",
      feedback:
        "The first `setTimeout` only schedules delayed work; it does not print immediately. `run()` is called in the current script, so `run async` prints right away before either timer callback.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "run async, script, timeout, run timeout",
      feedback:
        "`run()` logs `run async` synchronously right away. After `await`, the continuation logs `script` as a microtask before any zero-delay timer callbacks, and the timers print later in registration order.",
      isCorrect: true,
      order: 3,
    },
  ],
};
