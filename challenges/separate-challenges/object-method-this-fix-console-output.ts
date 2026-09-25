export const objectMethodThisFixConsoleOutputChallenge = {
  slug: "object-method-this-fix-console-output",
  snippetId: "84d7eacd-95cd-44b7-a72f-957085cb0dfa",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "John",
      feedback:
        "Correct. The snippet uses this inside an object method so the method works after reassignment, so the output is `John`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "undefined",
      feedback: "Not quite. The output is `John`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "TypeError",
      feedback: "Not quite. The output is `John`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
