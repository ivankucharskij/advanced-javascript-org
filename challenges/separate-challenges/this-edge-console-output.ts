export const thisEdgeConsoleOutputChallenge = {
  slug: "this-edge-console-output",
  snippetId: "347bd14a-4f5d-417b-b85b-05e830e99dbf",
  topicSlug: "core-concepts",
  title: "Predict the edge-case console output",
  prompt: "What does this edge case print?",
  code: "try {\n  users.customFilterNoThis(army.canJoin);\n} catch (error) {\n  console.log(error.name);\n}",
  order: 2,
  options: [
    {
      label: "[], then TypeError",
      feedback:
        "Not quite. The fixed calls both keep the two users whose ages are in range.",
      isCorrect: false,
      order: 1,
    },
    {
      label:
        "[{ age: 20 }, { age: 23 }], [{ age: 20 }, { age: 23 }], then TypeError",
      feedback:
        "Correct. The reusable snippet logs the two fixed arrays first, then the edge case passes the method without a receiver and catches the resulting `TypeError`.",
      isCorrect: true,
      order: 2,
    },
    {
      label: "TypeError only",
      feedback:
        "Not quite. The reusable snippet logs the two fixed arrays before the edge-case code runs.",
      isCorrect: false,
      order: 3,
    },
  ],
};
