export const promiseLifecycleAndEventLoopTimingConsoleOutputChallenge = {
  slug: "promise-lifecycle-and-event-loop-timing-console-output",
  snippetId: "560aebcb-0250-437c-9a5c-2830288777c1",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "Promise callback (.then) resolved, then Promise callback",
      feedback:
        "The executor is the first part of the Promise to run; `.then()` cannot run before it.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        "Promise callback, Promise callback end, Promise (pending) ..., Promise callback (.then) resolved, event-loop cycle: Promise (fulfilled) ...",
      feedback:
        "The source explains that the executor runs immediately, `.then()` runs after the current stack, and the timer runs after promise microtasks.",
      isCorrect: true,
      order: 2,
    },
    {
      label:
        "event-loop cycle: Promise (fulfilled) ... before Promise callback (.then) resolved",
      feedback: "Promise microtasks run before zero-delay timer callbacks.",
      isCorrect: false,
      order: 3,
    },
  ],
};
