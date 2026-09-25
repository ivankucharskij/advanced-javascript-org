export const objectCreateConsoleOutputChallenge = {
  slug: "object-create-console-output",
  snippetId: "c7edf06a-3a33-4239-8662-65ba04f17889",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "vehicle was made in 2010",
      feedback: "Not quite. The output is `BMW was made in 2010`.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "BMW was made in 2010",
      feedback:
        "Correct. The snippet creates an object with a prototype method and reads instance-specific properties, so the output is `BMW was made in 2010`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "undefined was made in undefined",
      feedback: "Not quite. The output is `BMW was made in 2010`.",
      isCorrect: false,
      order: 3,
    },
  ],
};
