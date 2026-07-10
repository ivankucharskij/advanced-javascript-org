export const orderbyConsoleOutputChallenge = {
  slug: "orderby-console-output",
  snippetId: "94f1971f-94e5-43bb-bb8f-43dcbb67d2bd",
  topicSlug: "lodash",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: 'const users = [{ name: "Ada", age: 30 }, { name: "Linus", age: 20 }];\r\nconsole.log(orderBy(users, "age", "desc")[0].name);',
  order: 1,
  options: [
    {
      label: "Linus",
      feedback: "Not quite. Descending age places the older user first.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "[Ada, Linus]",
      feedback:
        "Not quite. The code logs only `[0].name`, not the whole sorted order.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "Ada",
      feedback:
        "Correct. The snippet sorts a copied array by a property in ascending or descending order, so the output is `Ada`.",
      isCorrect: true,
      order: 3,
    },
  ],
};
