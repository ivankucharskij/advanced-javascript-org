export const promiseAllsettledConsoleOutputChallenge = {
  slug: "promise-allsettled-console-output",
  snippetId: "7c41b8a2-ff24-4652-8073-f0085c589b51",
  topicSlug: "promises",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: 'fulfilled 1, rejected Error("Whoops!"), fulfilled 3',
      feedback:
        "Correct. The reusable snippet logs the full allSettled result array after all three delayed inputs settle.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "fulfilled,rejected",
      feedback:
        "Not quite. That summarizes part of the statuses, but the snippet logs the full result objects including values and the error.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "rejected,fulfilled",
      feedback:
        "Not quite. `allSettled` preserves the original input order and includes three result objects.",
      isCorrect: false,
      order: 3,
    },
  ],
};
