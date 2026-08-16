export const promiseAllsettledEdgeConsoleOutputChallenge = {
  slug: "promise-allsettled-edge-console-output",
  snippetId: "7c41b8a2-ff24-4652-8073-f0085c589b51",
  topicSlug: "promises",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "Promise.customAllSettled([42]).then((result) => console.log(result[0].value));",
  order: 2,
  options: [
    {
      label: "42 only",
      feedback:
        "Not quite. The reusable snippet's delayed allSettled call also prints after the edge-case value.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "fulfilled",
      feedback:
        "Not quite. The challenge logs the value, and the reusable snippet still logs its own result later.",
      isCorrect: false,
      order: 2,
    },
    {
      label: '42, then fulfilled 1, rejected Error("Whoops!"), fulfilled 3',
      feedback:
        "Correct. The edge case logs `42` first, then the reusable snippet logs its delayed allSettled result array.",
      isCorrect: true,
      order: 3,
    },
  ],
};
