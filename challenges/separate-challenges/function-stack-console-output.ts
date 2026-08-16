export const functionStackConsoleOutputChallenge = {
  slug: "function-stack-console-output",
  snippetId: "80f25650-0102-4e2f-a6ee-0f30a9c2aa30",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "foo(2);",
  order: 1,
  options: [
    {
      label: "begin: 2, end: 2, begin: 1, end: 1, begin: 0, end: 0",
      feedback:
        "Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2",
      feedback:
        "Correct. The snippet shows recursive call-stack order by logging before and after nested calls, so the output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "begin: 0, begin: 1, begin: 2, end: 2, end: 1, end: 0",
      feedback:
        "Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
