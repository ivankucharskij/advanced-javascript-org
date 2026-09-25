export const lexicalEnvironmentScopeFixedConsoleOutputChallenge = {
  slug: "lexical-environment-scope-fixed-console-output",
  snippetId: "98a3674c-6313-4ec4-89e3-2ee58eb1ce2e",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "0, 1, 5",
      feedback:
        "Correct. Each loop iteration creates a new block-scoped `j`, so each shooter remembers the value from the iteration that created it.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "ReferenceError",
      feedback:
        "Not quite. `j` exists in the lexical environment captured by each returned shooter function.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "10, 10, 10",
      feedback:
        "Not quite. That is the broken closure behavior when every shooter reads the same changing loop variable.",
      isCorrect: false,
      order: 3,
    },
  ],
};
