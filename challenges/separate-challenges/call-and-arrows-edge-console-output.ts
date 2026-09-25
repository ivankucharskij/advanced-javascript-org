export const callAndArrowsEdgeConsoleOutputChallenge = {
  slug: "call-and-arrows-edge-console-output",
  snippetId: "b4f394ba-5619-49e1-a999-fc418a4b7eb7",
  topicSlug: "core-concepts",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "console.log(obj.regularMethod());\r\nconsole.log(obj.arrowMethod());",
  order: 2,
  options: [
    {
      label: "25, then undefined",
      feedback:
        "Correct. This follows the same implementation, so the output is `25, then undefined`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "25, then 25",
      feedback: "Not quite. This edge case outputs `25, then undefined`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "undefined, then undefined",
      feedback: "Not quite. This edge case outputs `25, then undefined`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
