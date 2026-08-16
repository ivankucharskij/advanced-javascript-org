export const asyncGeneratorConsoleOutputChallenge = {
  slug: "async-generator-console-output",
  snippetId: "030f8b46-fc6d-42de-a752-6387b10d0937",
  topicSlug: "core-concepts",
  title: "Predict the console output",
  prompt: "What does this code print?",
  code: "timer((value) => console.log(value));",
  order: 1,
  options: [
    {
      label: "Promise, Promise, Promise",
      feedback:
        "`for await` waits for each async generator step and passes the resolved yielded number to the callback. It does not print promises; it prints `1`, `2`, `3`, `4`, and `5` with about a one-second delay between each value.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "5, 4, 3, 2, 1",
      feedback:
        "The async generator counts upward from `start` to `end`, waiting one second before each `yield`. The values are printed with a delay, not right away, and the order is `1`, `2`, `3`, `4`, `5`.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "1, 2, 3, 4, 5",
      feedback:
        "The async generator waits one second before each `yield`, and `for await` consumes those yielded values in order. The values are not printed right away; console.log prints `1`, then `2`, `3`, `4`, and `5` with about a one-second delay between each value.",
      isCorrect: true,
      order: 3,
    },
  ],
};
