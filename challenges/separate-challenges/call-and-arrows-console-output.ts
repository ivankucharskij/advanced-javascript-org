export const callAndArrowsConsoleOutputChallenge = {
  slug: "call-and-arrows-console-output",
  snippetId: "e7c81592-c974-418d-bfa4-7ac9b8bea0d4",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log(obj.regularMethod.call(anotherObj));\r\nconsole.log(obj.arrowMethod.call(anotherObj));",
  order: 1,
  options: [
    {
      label: "25, then 50",
      feedback: "Not quite. The output is `50, then undefined`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "50, then undefined",
      feedback:
        "Correct. The snippet compares how call affects regular methods versus arrow functions, so the output is `50, then undefined`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "50, then 50",
      feedback: "Not quite. The output is `50, then undefined`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
