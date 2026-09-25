export const debounceConsoleOutputChallenge = {
  slug: "debounce-console-output",
  snippetId: "56f91652-390d-4a55-ba67-203a8ebfc3c9",
  topicSlug: "debounce-throttle",
  title: "Predict the console output",
  prompt: "What does the snippet print?",
  code: null,
  order: 1,
  options: [
    {
      label: "Logged after ... ms: a, b, c, d, e",
      feedback:
        "Debounced calls are postponed with `setTimeout`, not printed immediately. Rapid calls keep replacing the timer, so only the final call prints after the quiet period.",
      isCorrect: false,
      order: 1,
    },
    {
      label: "Logged after ... ms: a",
      feedback:
        "The first rapid call's timer is cleared by later calls. Nothing prints right away; after calls stop, the last scheduled call prints after the 500 ms delay.",
      isCorrect: false,
      order: 2,
    },
    {
      label: "Logged after ... ms: e",
      feedback:
        "Debounce clears the previous timer on each rapid call and starts a new one, so the wrapped function does not print right away. Only the final call runs after the configured 500 ms delay.",
      isCorrect: true,
      order: 3,
    },
  ],
};
