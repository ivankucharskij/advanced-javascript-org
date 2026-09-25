export const atConsoleOutputChallenge = {
  slug: "at-console-output",
  snippetId: "9b18fe55-4775-405f-bebe-eaa194d3787f",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'console.log(["a", "b", "c"].customAt(-1));',
  order: 1,
  options: [
    {
      label: "a",
      feedback: "Not quite. The output is `c`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "undefined",
      feedback: "Not quite. The output is `c`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "c",
      feedback:
        "Correct. The snippet reads an array value by index, including negative offsets from the end, so the output is `c`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
