export const clsxConsoleOutputChallenge = {
  slug: "clsx-console-output",
  snippetId: "74b709ba-99e9-4583-94c5-7bcd0afb863c",
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
