export const letInLoopsWithSettimeoutConsoleOutputChallenge = {
  slug: "let-in-loops-with-settimeout-console-output",
  snippetId: "757c829f-63d2-49e5-8803-1431f0007f6a",
  topicSlug: "event-loop",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "0, 1, 2, 3 after about 1 second",
      feedback:
        "The source explains that `let` gives each iteration its own block-scoped `i`. All callbacks run after the one-second timer delay.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "0, 1, 2, 3 immediately",
      feedback:
        "The values are distinct, but they are printed by `setTimeout` callbacks after about one second.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "4, 4, 4, 4 after about 1 second",
      feedback:
        "That would be the classic shared-variable result, but this snippet uses `let`, so each callback keeps a distinct value.",
      isCorrect: false,
      order: 3,
    },
  ],
};
