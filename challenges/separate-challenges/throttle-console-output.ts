export const throttleConsoleOutputChallenge = {
  slug: "throttle-console-output",
  snippetId: "6b5473a8-811b-48d2-8083-b00a80e8b95f",
  topicSlug: "debounce-throttle",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "Logged after 0 ms: a, b, c, d, e",
      feedback:
        "Calls inside the throttle window are ignored, so `b`, `d`, and `e` do not all print.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "Logged after ... ms: e only",
      feedback:
        "That is closer to debounce. Throttle runs the first call immediately.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "Logged after 0 ms: a, then around 600 ms Logged after ... ms: c",
      feedback:
        "The source contrasts throttle with debounce: throttle allows a call immediately, then blocks further calls until the time window ends.",
      isCorrect: true,
      order: 3,
    },
  ],
};
