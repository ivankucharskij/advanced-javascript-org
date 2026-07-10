export const filtermapConsoleOutputChallenge = {
  slug: "filtermap-console-output",
  snippetId: "c41fbc7c-323f-482e-812f-1fb0ad7605ee",
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
