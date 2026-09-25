export const filtermapConsoleOutputChallenge = {
  slug: "filtermap-console-output",
  snippetId: "bde66d08-6824-4766-8549-e6ef8476e637",
  topicSlug: "random",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "[ 'Alice', 'Bob', 'Charlie' ]",
      feedback:
        "The map callback returns names, but only for people that pass the active filter.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[ 'Bob' ]",
      feedback: "Bob is filtered out because `active` is false.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "[ 'Alice', 'Charlie' ]",
      feedback:
        "Correct. The snippet filters active people and maps the kept values to names, so the logged array contains Alice and Charlie.",
      isCorrect: true,
      order: 3,
    },
  ],
};
