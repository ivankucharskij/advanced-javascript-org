export const joinConsoleOutputChallenge = {
  slug: "join-console-output",
  snippetId: "3947bfc9-3422-46af-a8ff-23d5181d7ef0",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'console.log(["a", "b", "c"].customJoin("-"));',
  order: 1,
  options: [
    {
      label: "abc",
      feedback: "Not quite. The output is `a-b-c`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "a-b-c",
      feedback:
        "Correct. The snippet concatenates array values into a string with a configurable separator, so the output is `a-b-c`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "a,b,c",
      feedback: "Not quite. The output is `a-b-c`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
