export const scriptMicrotasksAndMacrotasksInExecutionOrderConsoleOutputChallenge =
  {
    slug: "script-microtasks-and-macrotasks-in-execution-order-console-output",
    snippetId: "61557457-4b82-46ab-a1cf-f8b5d79bb1ff",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label:
          "Script start, Script end, Promise constructor, After Promise constructor, Promise 1, Promise constructor resolve, Microtask queue, Promise 2, setTimeout",
        feedback:
          "The source summarizes the rule: synchronous code runs first, then promise and queued microtasks, then timer macrotasks.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "Script start, setTimeout, Script end, Promise 1, Promise 2",
        feedback:
          "The zero-delay timer is a macrotask, so it waits until after the current script and microtasks.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "Promise 1, Promise 2, Script start, Script end, setTimeout",
        feedback:
          "Promise callbacks do not run before the current script reaches the end.",
        isCorrect: false,
        order: 3,
      },
    ],
  };
