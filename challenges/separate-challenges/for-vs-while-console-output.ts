export const forVsWhileConsoleOutputChallenge = {
  slug: "for-vs-while-console-output",
  snippetId: "d7293006-8811-405e-8994-b2306fee79a3",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "1, 2, then 1, 2, 3, then 0, 1, 2, then 0, 1, 2",
      feedback:
        "`++i` increments before the while condition is checked; `i++` checks the old value first. In both `for` loops, the increment runs after the loop body, so `i++` and `++i` produce the same output there.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "1, 2, then 0, 1, 2, then 0, 1, 2, then 1, 2, 3",
      feedback:
        "The second `while` loop with `i2++` prints `1, 2, 3` before either `for` loop runs.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "0, 1, 2 four times",
      feedback:
        "The two `while` loops differ because their increment happens inside the condition expression.",
      isCorrect: false,
      order: 3,
    },
  ],
};
