export const nestedMicrotasksInMacrotasksConsoleOutputChallenge = {
  slug: "nested-microtasks-in-macrotasks-console-output",
  snippetId: "38f8a1d0-3044-4e30-9e77-a2991329ed04",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label:
        "Start, End, setTimeout 1, setTimeout 2, Promise 1, Promise 2, Promise inside setTimeout 1",
      feedback:
        "Initial promise callbacks run before timers, and the nested promise callback runs before the second timer.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        "Start, End, Promise 1, Promise 2, setTimeout 1, Promise inside setTimeout 1, setTimeout 2",
      feedback:
        "The source explains that microtasks run before macrotasks, and a microtask queued inside a timer runs immediately after that timer callback finishes.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "Promise 1, Promise 2, Start, End, setTimeout 1, setTimeout 2",
      feedback:
        "The script logs `Start` and `End` before any queued promise or timer callback runs.",
      isCorrect: false,
      order: 3,
    },
  ],
};
