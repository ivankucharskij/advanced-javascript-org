export const promiseAllEdgeConsoleOutputChallenge = {
  slug: "promise-all-edge-console-output",
  snippetId: "28628142-6036-4d87-8f19-276d421fa1bf",
  topicSlug: "promises",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "myPromiseAll([]).then((values) => console.log(JSON.stringify(values)));",
  order: 2,
  options: [
    {
      label: "undefined",
      feedback:
        "Not quite. The helper explicitly resolves empty input with an empty array.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[] only",
      feedback:
        "Not quite. The reusable snippet is still running, so its delayed promises print after the edge-case `[]`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: '[], second, first, third, then ["first", "second", "third"]',
      feedback:
        "Correct. The empty edge case logs `[]` first, then the reusable snippet's pending timers resolve and print their values.",
      isCorrect: true,
      order: 3,
    },
  ],
};
