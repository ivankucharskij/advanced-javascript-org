export const objectMethodThisConsoleOutputChallenge = {
  slug: "object-method-this-console-output",
  snippetId: "cf1a860b-46c2-4fd4-93bd-1685d2c306c6",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "TypeError",
      feedback:
        "Correct. The snippet shows why closing over an object variable can break after reassignment, so the output is `TypeError`.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "undefined",
      feedback: "Not quite. The output is `TypeError`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "John",
      feedback: "Not quite. The output is `TypeError`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
