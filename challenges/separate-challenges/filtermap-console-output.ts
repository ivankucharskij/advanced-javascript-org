export const filtermapConsoleOutputChallenge = {
  slug: "filtermap-console-output",
  snippetId: "299f83ea-5e6c-4cef-8db1-d1ac8c5dcf01",
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
