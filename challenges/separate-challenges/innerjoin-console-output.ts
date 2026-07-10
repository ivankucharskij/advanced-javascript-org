export const innerjoinConsoleOutputChallenge = {
  slug: "innerjoin-console-output",
  snippetId: "77dafae6-589b-455d-b7aa-510d91d7281c",
  topicSlug: "random",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: null,
  order: 1,
  options: [
    {
      label:
        '[{ id: 456, name: "Stephen Stills" }, { id: 177, name: "Neil Young" }]',
      feedback:
        "Correct. The snippet logs the filtered records themselves, preserving record order from the original array.",
      isCorrect: true,
      order: 1,
    },
    {
      label: "Stephen Stills, Neil Young",
      feedback:
        "Not quite. The snippet logs the array of matching record objects, not just the joined names.",
      isCorrect: false,
      order: 2,
    },
    {
      label:
        '[{ id: 177, name: "Neil Young" }, { id: 456, name: "Stephen Stills" }]',
      feedback:
        "Not quite. `filter` keeps the original record order, so Stephen Stills appears before Neil Young.",
      isCorrect: false,
      order: 3,
    },
  ],
};
