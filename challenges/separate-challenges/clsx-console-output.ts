export const clsxConsoleOutputChallenge = {
  slug: "clsx-console-output",
  snippetId: "f136f95d-bb51-4ef8-9b47-6f408f905d73",
  topicSlug: "random",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'console.log(clsx("btn", ["active", false], { hidden: false, primary: true }));',
  order: 1,
  options: [
    {
      label: "btn active primary",
      feedback:
        "Correct. The snippet builds a className string from strings, arrays, and conditional object keys, so the output is `btn active primary`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "btn primary active false",
      feedback: "Not quite. The output is `btn active primary`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "btn active hidden primary",
      feedback: "Not quite. The output is `btn active primary`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
