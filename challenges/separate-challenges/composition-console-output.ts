export const compositionConsoleOutputChallenge = {
  slug: "composition-console-output",
  snippetId: "5d4a8d85-968e-44ed-9ebc-c779bb3288cd",
  topicSlug: "composition-vs-inheritance",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: 'One string like "Today Tue Jul 07 2026"',
      feedback:
        "Not quite. The source logs once through the direct steps and once through the composed pipeline.",
      isCorrect: false,
      order: 1,
    },
    {
      label: 'Two matching strings like "Today Tue Jul 07 2026"',
      feedback:
        "Correct. The direct function calls log the date label once, then the composed `pipe` version builds and logs the same kind of label again.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "The raw Date object",
      feedback:
        "Not quite. The date is converted with `toDateString()` before it is logged.",
      isCorrect: false,
      order: 3,
    },
  ],
};
