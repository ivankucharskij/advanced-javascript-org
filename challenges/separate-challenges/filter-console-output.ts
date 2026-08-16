export const filterConsoleOutputChallenge = {
  slug: "filter-console-output",
  snippetId: "c1088e64-b8b6-499a-b2cc-091321854eb1",
  topicSlug: "array-methods",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0));",
  order: 1,
  options: [
    {
      label: "[false,true,false,true]",
      feedback:
        "Not quite. `filter` returns the original items that pass, not the callback results.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[2,4]",
      feedback:
        "Correct. The saved snippet defines `myFilter`, and it keeps only values whose callback returns true.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "[1,3]",
      feedback:
        "Not quite. Those are the values rejected by the even-number predicate.",
      isCorrect: false,
      order: 3,
    },
  ],
};
