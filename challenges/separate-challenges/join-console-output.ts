export const joinConsoleOutputChallenge = {
  slug: "join-console-output",
  snippetId: "3477ad92-e041-48e1-9aa6-c98e97a7e8e9",
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
