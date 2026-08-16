export const objectGroupbyConsoleOutputChallenge = {
  slug: "object-groupby-console-output",
  snippetId: "65edba6b-734d-4c08-8068-2742b2092cc0",
  topicSlug: "map-and-set",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const grouped = groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"));\r\nconsole.log(grouped);',
  order: 1,
  options: [
    {
      label: "[[1,3],[2,4]]",
      feedback: 'Not quite. The output is `{"odd":[1,3],"even":[2,4]}`.',
      isCorrect: false,
      order: 1,
    },
    {
      label: '{"odd":[1,3],"even":[2,4]}',
      feedback:
        'Correct. The snippet groups array items into an object keyed by a callback result, so the output is `{"odd":[1,3],"even":[2,4]}`.',
      isCorrect: true,
      order: 2,
    },
    {
      label: '{"even":[1,3],"odd":[2,4]}',
      feedback: 'Not quite. The output is `{"odd":[1,3],"even":[2,4]}`.',
      isCorrect: false,
      order: 3,
    },
  ],
};
