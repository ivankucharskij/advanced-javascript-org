export const lexicalEnvironmentScopeBrokenConsoleOutputChallenge = {
  slug: "lexical-environment-scope-broken-console-output",
  snippetId: "70528f36-0bc1-4c00-8270-ef6b1bfcbbcc",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label: "0, 1, 5",
      feedback:
        "Not quite. That would require each shooter to close over a separate per-iteration value.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "10, 10, 10",
      feedback:
        "Correct. Every shooter closes over the same `i` variable, and by the time any shooter runs the loop has finished with `i === 10`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "ReferenceError",
      feedback:
        "Not quite. `i` is in scope for the returned functions; the bug is that all of them read the same final value.",
      isCorrect: false,
      order: 3,
    },
  ],
};
