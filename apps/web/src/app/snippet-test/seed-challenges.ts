export const seedChallenges = [
  {
    slug: "async-function-and-timer-execution-order-output",
    snippetId: "e05d4397-a43f-4061-b48b-d800c28ce6e2",
    topicSlug: "event-loop",
    title: "Predict async function and timer output order",
    prompt: "What is the console output order?",
    code: null,
    order: 1,
    options: [
      {
        label: "run async, timeout, run timeout, script",
        feedback:
          "Zero-delay timers are still delayed to later macrotasks. The awaited async continuation runs first as a microtask, so `script` prints before `timeout` and `run timeout`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "timeout, run async, script, run timeout",
        feedback:
          "The first `setTimeout` only schedules delayed work; it does not print immediately. `run()` is called in the current script, so `run async` prints right away before either timer callback.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "run async, script, timeout, run timeout",
        feedback:
          "`run()` logs `run async` synchronously right away. After `await`, the continuation logs `script` as a microtask before any zero-delay timer callbacks, and the timers print later in registration order.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "async-generator-console-output",
    snippetId: "bd24d6c1-0561-4132-b156-65768814335a",
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
  },
  {
    slug: "at-console-output",
    snippetId: "6009409a-7b31-4933-934b-de0c4b9a5ba2",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'console.log(["a", "b", "c"].customAt(-1));',
    order: 1,
    options: [
      {
        label: "a",
        feedback: "Not quite. The output is `c`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "undefined",
        feedback: "Not quite. The output is `c`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "c",
        feedback:
          "Correct. The snippet reads an array value by index, including negative offsets from the end, so the output is `c`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "bind-console-output",
    snippetId: "e81fa2eb-e9a4-4ab1-ae25-7fb8817958c7",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "Hello, John!, then Hello, John!",
        feedback:
          "The timer callback receives the unbound method, not a wrapper or `bind(user)` result.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "Hello, John!, then Hello, undefined!",
        feedback:
          "The source explains that passing `user.sayHi` to `setTimeout` removes the object before the dot, so the method loses its receiver.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "Hello, undefined!, then Hello, John!",
        feedback:
          "`user.sayHi()` is called as a method first, so it has `user` as its receiver.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "blocking-inside-async-callbacks-console-output",
    snippetId: "92a13335-dd7c-45c8-934e-48dc0b0be726",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label:
          "Start, End, Non-blocking Operation, Long-Running Task Completed, Start Long-Running Task",
        feedback:
          "`longRunningTask()` logs its start before entering the blocking loop, then logs completion after the loop finishes.",
        isCorrect: false,
        order: 1,
      },
      {
        label:
          "Start, End, Non-blocking Operation, Start Long-Running Task, then after about 2s Long-Running Task Completed",
        feedback:
          "The source explains that scheduling with `setTimeout` does not make the callback's long synchronous work interruptible. The callback starts after `Start` and `End`, then its loop blocks until completion.",
        isCorrect: true,
        order: 2,
      },
      {
        label:
          "Start, Non-blocking Operation, End, Start Long-Running Task, Long-Running Task Completed",
        feedback:
          "The timer callback does not run before the current script finishes, so `End` appears before `Non-blocking Operation`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "blocking-the-event-loop-with-a-while-loop-console-output",
    snippetId: "16c3f529-d2ca-42f5-bc8b-32c91edbd50b",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "Ran after 0.5 seconds, then Good, looped for 2 seconds",
        feedback:
          "A timer callback cannot interrupt synchronous JavaScript that is already running.",
        isCorrect: false,
        order: 1,
      },
      {
        label:
          "Good, looped for 2 seconds, then Ran after ... seconds at roughly 2 seconds",
        feedback:
          "The source explains that the 500 ms timer is delayed until the blocking loop finishes, which is after roughly two seconds.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "Good, looped for 2 seconds only",
        feedback:
          "The loop delays the timer, but it does not cancel the scheduled callback.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "call-and-arrows-console-output",
    snippetId: "e7c81592-c974-418d-bfa4-7ac9b8bea0d4",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log(obj.regularMethod.call(anotherObj));\r\nconsole.log(obj.arrowMethod.call(anotherObj));",
    order: 1,
    options: [
      {
        label: "25, then 50",
        feedback: "Not quite. The output is `50, then undefined`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "50, then undefined",
        feedback:
          "Correct. The snippet compares how call affects regular methods versus arrow functions, so the output is `50, then undefined`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "50, then 50",
        feedback: "Not quite. The output is `50, then undefined`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "call-and-arrows-edge-console-output",
    snippetId: "e7c81592-c974-418d-bfa4-7ac9b8bea0d4",
    topicSlug: "core-concepts",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "console.log(obj.regularMethod());\r\nconsole.log(obj.arrowMethod());",
    order: 2,
    options: [
      {
        label: "25, then undefined",
        feedback:
          "Correct. This follows the same implementation, so the output is `25, then undefined`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "25, then 25",
        feedback: "Not quite. This edge case outputs `25, then undefined`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "undefined, then undefined",
        feedback: "Not quite. This edge case outputs `25, then undefined`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "clsx-console-output",
    snippetId: "f136f95d-bb51-4ef8-9b47-6f408f905d73",
    topicSlug: "random",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'console.log(clsx("btn", ["active", false], { hidden: false, primary: true }));',
    order: 1,
    options: [
      {
        label: "btn active primary",
        feedback:
          "Correct. The snippet builds a className string from strings, arrays, and conditional object keys, so the output is `btn active primary`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "btn primary active false",
        feedback: "Not quite. The output is `btn active primary`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "btn active hidden primary",
        feedback: "Not quite. The output is `btn active primary`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "clsx-edge-console-output",
    snippetId: "f136f95d-bb51-4ef8-9b47-6f408f905d73",
    topicSlug: "random",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: 'console.log(clsx(["a", ["b", { c: true, d: false }]], null, "e"));',
    order: 2,
    options: [
      {
        label: "a b c e",
        feedback:
          "Correct. This follows the same implementation, so the output is `a b c e`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "a,b,c,e",
        feedback: "Not quite. This edge case outputs `a b c e`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "a b c d e",
        feedback: "Not quite. This edge case outputs `a b c e`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "composition-console-output",
    snippetId: "d4538e0c-6941-4cca-bf68-3090bdbbb50c",
    topicSlug: "composition-vs-inheritance",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: 'One string like "Today Tue Jul 07 2026"',
        feedback:
          "Not quite. The source logs once through the direct steps and once through the composed pipeline.",
        isCorrect: false,
        order: 1,
      },
      {
        label: 'Two matching strings like "Today Tue Jul 07 2026"',
        feedback:
          "Correct. The direct function calls log the date label once, then the composed `pipe` version builds and logs the same kind of label again.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "The raw Date object",
        feedback:
          "Not quite. The date is converted with `toDateString()` before it is logged.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "concat-console-output",
    snippetId: "2a06ba1d-3ee6-4dc1-a485-cf4e7b22f4eb",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const numbers = [1, 2];\r\nconsole.log(JSON.stringify(numbers.myConcat([3, 4], 5)));",
    order: 1,
    options: [
      {
        label: "[3,4,5]",
        feedback: "Not quite. The output is `[1,2,3,4,5]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[1,2,3,4,5]",
        feedback:
          "Correct. The snippet combines the receiver with arrays or individual values and returns a new array, so the output is `[1,2,3,4,5]`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "[1,2,[3,4],5]",
        feedback: "Not quite. The output is `[1,2,3,4,5]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "curry-console-output",
    snippetId: "b310ec38-e517-4c52-acd5-f91f1b9196fa",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const add = (a, b, c) => a + b + c;\r\nconsole.log(curry(add)(1)(2)(3));",
    order: 1,
    options: [
      {
        label: "123",
        feedback: "Not quite. The output is `6`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "3",
        feedback: "Not quite. The output is `6`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "6",
        feedback:
          "Correct. The snippet transforms a fixed-arity function into a chain of partially applied calls, so the output is `6`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "debounce-console-output",
    snippetId: "3cea4ad2-2fba-4d7f-b54d-7bfbe90e15a6",
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
  },
  {
    slug: "difference-console-output",
    snippetId: "63109132-883e-47b3-8d68-b66c85642269",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log(findDifference([1, 2, 3], [2, 4]));",
    order: 1,
    options: [
      {
        label: "[1,3]",
        feedback:
          "Not quite. That is only the left-side difference; this helper returns `[diffLeft, diffRight]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[[1,3],[]]",
        feedback:
          "Not quite. `4` is unique to the second array, so the right-side difference is not empty.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[[1,3],[4]]",
        feedback:
          "Correct. `findDifference` returns both sides: values only in the first array, then values only in the second array.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "differenceby-console-output",
    snippetId: "4123a3b9-12c2-46fa-87cb-cd3b442c9bba",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const left = [{ id: 1 }, { id: 2 }];\r\nconst right = [{ id: 2 }, { id: 3 }];\r\nconsole.log(differenceBy(left, right, "id"));',
    order: 1,
    options: [
      {
        label: '[[{"id":2}],[]]',
        feedback: 'Not quite. The output is `[[{"id":1}],[{"id":3}]]`.',
        isCorrect: false,
        order: 1,
      },
      {
        label: '[[{"id":1}],[{"id":3}]]',
        feedback:
          'Correct. The snippet computes object differences by comparing a selected property value, so the output is `[[{"id":1}],[{"id":3}]]`.',
        isCorrect: true,
        order: 2,
      },
      {
        label: '[{"id":1},{"id":3}]',
        feedback: 'Not quite. The output is `[[{"id":1}],[{"id":3}]]`.',
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "every-console-output",
    snippetId: "6797db4c-b801-421c-8c83-e0ba82991076",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([2, 4, 6].customEvery((n) => n % 2 === 0));",
    order: 1,
    options: [
      {
        label: "false",
        feedback: "Not quite. Every value in `[2, 4, 6]` is even.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[true,true,true]",
        feedback:
          "Not quite. `every` returns one boolean, not the callback result for every item.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Correct. The snippet checks whether all array items satisfy a predicate callback, so the output is `true`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "fill-console-output",
    snippetId: "af4084a5-7dfc-4e7b-86c6-108d3ce7b682",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customFill(0, 1, 3));",
    order: 1,
    options: [
      {
        label: "[0,0,0,4]",
        feedback: "Not quite. The output is `[1,0,0,4]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[1,0,3,4]",
        feedback: "Not quite. The output is `[1,0,0,4]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[1,0,0,4]",
        feedback:
          "Correct. The snippet mutates an array by writing one value across a normalized start and end range, so the output is `[1,0,0,4]`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "fill-edge-console-output",
    snippetId: "af4084a5-7dfc-4e7b-86c6-108d3ce7b682",
    topicSlug: "array-methods",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "const values = [1, 2, 3, 4];\r\nconsole.log(JSON.stringify(values.customFill(9, -2)));",
    order: 2,
    options: [
      {
        label: "[9,9,3,4]",
        feedback: "Not quite. This edge case outputs `[1,2,9,9]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[1,2,3,4]",
        feedback: "Not quite. This edge case outputs `[1,2,9,9]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[1,2,9,9]",
        feedback:
          "Correct. This follows the same implementation, so the output is `[1,2,9,9]`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "filter-console-output",
    snippetId: "d6b16758-94e0-4f6d-9b7d-e0c608dde64a",
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
  },
  {
    slug: "filtermap-console-output",
    snippetId: "c41fbc7c-323f-482e-812f-1fb0ad7605ee",
    topicSlug: "random",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "[ 'Alice', 'Bob', 'Charlie' ]",
        feedback:
          "The map callback returns names, but only for people that pass the active filter.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[ 'Bob' ]",
        feedback: "Bob is filtered out because `active` is false.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[ 'Alice', 'Charlie' ]",
        feedback:
          "Correct. The snippet filters active people and maps the kept values to names, so the logged array contains Alice and Charlie.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "find-console-output",
    snippetId: "57b973f9-7eea-48a0-ad8c-5342a353756d",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 4, 6].customFind((n) => n > 3));",
    order: 1,
    options: [
      {
        label: "4",
        feedback:
          "Correct. The snippet returns the first item that satisfies a predicate callback, so the output is `4`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "6",
        feedback: "Not quite. The output is `4`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "undefined",
        feedback: "Not quite. The output is `4`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "findlast-console-output",
    snippetId: "07051a5d-5d36-4481-b8e7-b542a2bac766",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 4, 6].customFindLast((n) => n > 3));",
    order: 1,
    options: [
      {
        label: "4",
        feedback: "Not quite. The output is `6`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "undefined",
        feedback: "Not quite. The output is `6`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "6",
        feedback:
          "Correct. The snippet scans from the end to return the last item that satisfies a predicate callback, so the output is `6`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "flat-console-output",
    snippetId: "7f578f70-abe4-4a85-a666-cd25f88911c4",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, [2, [3]], 4].customFlat(1));",
    order: 1,
    options: [
      {
        label: "[1,2,[3],4]",
        feedback:
          "Correct. The snippet recursively flattens nested arrays up to a requested depth, so the output is `[1,2,[3],4]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "[1,2,3,4]",
        feedback: "Not quite. The output is `[1,2,[3],4]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[1,[2,[3]],4]",
        feedback: "Not quite. The output is `[1,2,[3],4]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "flat-edge-console-output",
    snippetId: "7f578f70-abe4-4a85-a666-cd25f88911c4",
    topicSlug: "array-methods",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "console.log([1, [2, [3]]].customFlat(2));",
    order: 2,
    options: [
      {
        label: "[1,2,3]",
        feedback:
          "Correct. This follows the same implementation, so the output is `[1,2,3]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "[1,2,[3]]",
        feedback: "Not quite. This edge case outputs `[1,2,3]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[1,[2,[3]]]",
        feedback: "Not quite. This edge case outputs `[1,2,3]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "flatmap-console-output",
    snippetId: "0e52477a-ffda-4487-b4f5-a9ede575cf40",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 2, 3].customFlatMap((n) => [n, n * 2]));",
    order: 1,
    options: [
      {
        label: "[1,2,2,4,3,6]",
        feedback:
          "Correct. The snippet maps each item and flattens array results by one level, so the output is `[1,2,2,4,3,6]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "[[1,2],[2,4],[3,6]]",
        feedback: "Not quite. The output is `[1,2,2,4,3,6]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[2,4,6]",
        feedback: "Not quite. The output is `[1,2,2,4,3,6]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "for-vs-while-console-output",
    snippetId: "e91830e5-de05-45d8-b190-212a49ed7843",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "1, 2, then 1, 2, 3, then 0, 1, 2, then 0, 1, 2",
        feedback:
          "`++i` increments before the while condition is checked; `i++` checks the old value first. In both `for` loops, the increment runs after the loop body, so `i++` and `++i` produce the same output there.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "1, 2, then 0, 1, 2, then 0, 1, 2, then 1, 2, 3",
        feedback:
          "The second `while` loop with `i2++` prints `1, 2, 3` before either `for` loop runs.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "0, 1, 2 four times",
        feedback:
          "The two `while` loops differ because their increment happens inside the condition expression.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "function-stack-console-output",
    snippetId: "d4d50575-2588-4c51-9b5d-a18ad0f62354",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "foo(2);",
    order: 1,
    options: [
      {
        label: "begin: 2, end: 2, begin: 1, end: 1, begin: 0, end: 0",
        feedback:
          "Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2",
        feedback:
          "Correct. The snippet shows recursive call-stack order by logging before and after nested calls, so the output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "begin: 0, begin: 1, begin: 2, end: 2, end: 1, end: 0",
        feedback:
          "Not quite. The output is `begin: 2, begin: 1, begin: 0, end: 0, end: 1, end: 2`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "has-path-bfs-console-output",
    snippetId: "0b0589f7-7c80-430e-9079-baadd189a967",
    topicSlug: "graph-traversal",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const graph = { a: ["b"], b: ["c"], c: [] };\r\nconsole.log(hasPath(graph, "c", "a"));',
    order: 1,
    options: [
      {
        label: "TypeError",
        feedback:
          "Not quite. `graph.c` exists as an empty array, so the loop ends normally and returns false.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "false",
        feedback:
          "Correct. The snippet searches a directed graph with a queue to determine whether a destination is reachable, so the output is `false`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Not quite. BFS starts at `c`; there is no outgoing path from `c` back to `a` in this directed graph.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "has-path-dfs-console-output",
    snippetId: "f7b47d7a-92f5-4512-9c81-b645f8f78538",
    topicSlug: "graph-traversal",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const graph = { a: ["b", "c"], b: ["d"], c: [], d: [] };\r\nconsole.log(hasPath(graph, "a", "d"));',
    order: 1,
    options: [
      {
        label: "true, then d",
        feedback:
          "Not quite. The function returns a boolean; it does not log the destination node separately.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "false",
        feedback: "Not quite. DFS can reach `d` by following `a -> b -> d`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Correct. The snippet searches a directed graph recursively to determine whether a destination is reachable, so the output is `true`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "has-path-dfs-edge-console-output",
    snippetId: "f7b47d7a-92f5-4512-9c81-b645f8f78538",
    topicSlug: "graph-traversal",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: 'const graph = { a: ["b"], b: [], c: [] };\r\nconsole.log(hasPath(graph, "a", "c"));',
    order: 2,
    options: [
      {
        label: "RangeError",
        feedback:
          "Not quite. There is no cycle in this input, so recursion terminates normally.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "false",
        feedback:
          "Correct. This follows the same implementation, so the output is `false`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Not quite. `c` exists, but it is disconnected from `a` in this directed graph.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "includes-console-output",
    snippetId: "38479e07-cdaf-47ef-9c9b-a669331de990",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, NaN, 3].customIncludes(NaN));",
    order: 1,
    options: [
      {
        label: "false",
        feedback: "Not quite. The output is `true`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "true",
        feedback:
          "Correct. The snippet searches an array using SameValueZero equality, including NaN matching, so the output is `true`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "NaN",
        feedback: "Not quite. The output is `true`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "includes-edge-console-output",
    snippetId: "38479e07-cdaf-47ef-9c9b-a669331de990",
    topicSlug: "array-methods",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "console.log([1, 2, 3, 2].customIncludes(2, -2));",
    order: 2,
    options: [
      {
        label: "false",
        feedback: "Not quite. This edge case outputs `true`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "2",
        feedback: "Not quite. This edge case outputs `true`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Correct. This follows the same implementation, so the output is `true`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
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
  },
  {
    slug: "intersection-console-output",
    snippetId: "f94bd2a2-bd9c-485d-928a-4fb745128ab1",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log(intersection([1, 2, 3], [2, 3, 4]));",
    order: 1,
    options: [
      {
        label: "[1,4]",
        feedback: "Not quite. The output is `[2,3]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[2,3]",
        feedback:
          "Correct. The snippet returns values present in both arrays using Set membership, so the output is `[2,3]`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "[1,2,3,4]",
        feedback: "Not quite. The output is `[2,3]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "join-console-output",
    snippetId: "3947bfc9-3422-46af-a8ff-23d5181d7ef0",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'console.log(["a", "b", "c"].customJoin("-"));',
    order: 1,
    options: [
      {
        label: "abc",
        feedback: "Not quite. The output is `a-b-c`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "a-b-c",
        feedback:
          "Correct. The snippet concatenates array values into a string with a configurable separator, so the output is `a-b-c`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "a,b,c",
        feedback: "Not quite. The output is `a-b-c`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "keyby-console-output",
    snippetId: "696af8f0-f026-4e5f-9c0e-af2d54eeb775",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const users = [{ id: "a", name: "Ada" }, { id: "b", name: "Brendan" }];\r\nconsole.log(keyBy(users, "id").b.name);',
    order: 1,
    options: [
      {
        label: "Brendan",
        feedback:
          "Correct. The snippet indexes collection items by a property name or iteratee result, so the output is `Brendan`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: '{ id: "b", name: "Brendan" }',
        feedback:
          "Not quite. The code reads `.name`, so it logs the name string rather than the whole record.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "Ada",
        feedback:
          "Not quite. Key `b` points to the second user, not the first one.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "let-in-loops-with-settimeout-console-output",
    snippetId: "7881ac86-e0cd-4b8b-b114-6fa52c2c7437",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "0, 1, 2, 3 after about 1 second",
        feedback:
          "The source explains that `let` gives each iteration its own block-scoped `i`. All callbacks run after the one-second timer delay.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "0, 1, 2, 3 immediately",
        feedback:
          "The values are distinct, but they are printed by `setTimeout` callbacks after about one second.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "4, 4, 4, 4 after about 1 second",
        feedback:
          "That would be the classic shared-variable result, but this snippet uses `let`, so each callback keeps a distinct value.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
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
  },
  {
    slug: "lexical-environment-scope-fixed-console-output",
    snippetId: "b7ab9391-3c86-4e1f-b803-f228b3bf6f65",
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
  },
  {
    slug: "map-console-output",
    snippetId: "e1573c2b-f658-4cdf-982f-671453849768",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 2, 3].customMap((n) => n * 2));",
    order: 1,
    options: [
      {
        label: "[2,4,6]",
        feedback:
          "Correct. The snippet transforms every array item with a callback and returns the mapped values, so the output is `[2,4,6]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "[2,3,4]",
        feedback: "Not quite. The output is `[2,4,6]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[1,2,3]",
        feedback: "Not quite. The output is `[2,4,6]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "method-chaining-console-output",
    snippetId: "e9fc77ef-da9f-431c-b0ed-2d158ba3569b",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "2, then 1",
        feedback: "Not quite. The output is `1, then 0`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "0, then -1",
        feedback: "Not quite. The output is `1, then 0`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "1, then 0",
        feedback:
          "Correct. The snippet returns this from object methods to support chained state updates, so the output is `1, then 0`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "nested-microtasks-in-macrotasks-console-output",
    snippetId: "38f8a1d0-3044-4e30-9e77-a2991329ed04",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label:
          "Start, End, setTimeout 1, setTimeout 2, Promise 1, Promise 2, Promise inside setTimeout 1",
        feedback:
          "Initial promise callbacks run before timers, and the nested promise callback runs before the second timer.",
        isCorrect: false,
        order: 1,
      },
      {
        label:
          "Start, End, Promise 1, Promise 2, setTimeout 1, Promise inside setTimeout 1, setTimeout 2",
        feedback:
          "The source explains that microtasks run before macrotasks, and a microtask queued inside a timer runs immediately after that timer callback finishes.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "Promise 1, Promise 2, Start, End, setTimeout 1, setTimeout 2",
        feedback:
          "The script logs `Start` and `End` before any queued promise or timer callback runs.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "object-create-console-output",
    snippetId: "f9c43ca8-b61b-4321-8584-011c14e92486",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "vehicle was made in 2010",
        feedback: "Not quite. The output is `BMW was made in 2010`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "BMW was made in 2010",
        feedback:
          "Correct. The snippet creates an object with a prototype method and reads instance-specific properties, so the output is `BMW was made in 2010`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "undefined was made in undefined",
        feedback: "Not quite. The output is `BMW was made in 2010`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "object-groupby-console-output",
    snippetId: "f0da9141-cd18-4af2-9d86-99ee75233313",
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
  },
  {
    slug: "object-literal-this-console-output",
    snippetId: "f021b91b-3bc6-4c58-9a9c-48745461ac38",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "undefined, then undefined",
        feedback:
          "Not quite. The method form `ref()` receives `user2` as its receiver when called through `user2.ref()`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "undefined, then John",
        feedback:
          "Correct. `ref: this` captures the surrounding function call context, while `ref()` is called as a method of `user2`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "John, then John",
        feedback:
          "Not quite. An object literal does not create `this` for the `ref: this` property value.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "object-method-this-console-output",
    snippetId: "cf1a860b-46c2-4fd4-93bd-1685d2c306c6",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "TypeError",
        feedback:
          "Correct. The snippet shows why closing over an object variable can break after reassignment, so the output is `TypeError`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "undefined",
        feedback: "Not quite. The output is `TypeError`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "John",
        feedback: "Not quite. The output is `TypeError`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "object-method-this-fix-console-output",
    snippetId: "a7e7a3d2-40f9-42c0-ac4e-05b06c179213",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "John",
        feedback:
          "Correct. The snippet uses this inside an object method so the method works after reassignment, so the output is `John`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "undefined",
        feedback: "Not quite. The output is `John`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "TypeError",
        feedback: "Not quite. The output is `John`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "omit-console-output",
    snippetId: "4dd5d6aa-a36d-4ee1-b58a-6c6e1d4b0e8c",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'console.log(omit({ a: 1, b: 2, c: 3 }, ["b"]));',
    order: 1,
    options: [
      {
        label: '{"b":2}',
        feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
        isCorrect: false,
        order: 1,
      },
      {
        label: '{"a":1,"c":3}',
        feedback:
          'Correct. The snippet returns a shallow object copy with one or more keys removed, so the output is `{"a":1,"c":3}`.',
        isCorrect: true,
        order: 2,
      },
      {
        label: '{"a":1,"b":2,"c":3}',
        feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
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
  },
  {
    slug: "output-every-second-2-console-output",
    snippetId: "8ecb0a9d-d9e9-4a3b-861e-14539b66dab3",
    topicSlug: "debounce-throttle",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "5 through 10, all after one second",
        feedback:
          "The first value is printed by the initial `go()` call before any timeout is scheduled.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "10 down to 5 with one-second gaps",
        feedback:
          "The function increments `current`, so it prints the range from `5` to `10`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "5 immediately, then 6 through 10 with one-second gaps",
        feedback:
          "The source explains that recursive `setTimeout` schedules the next run after the current run finishes. Here the first `go()` call prints `5` immediately.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "output-every-second-console-output",
    snippetId: "f3f74a08-3c13-4645-b8d3-2167528a3963",
    topicSlug: "debounce-throttle",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "10 down to 5 with one-second gaps",
        feedback:
          "`current` starts at `from` and increments, so the sequence is ascending.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "5 through 10, all after one second",
        feedback: "The first value is printed before `setInterval` is started.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "5 immediately, then 6 through 10 with one-second gaps",
        feedback:
          "The source says the first call to `go()` prints `5` immediately, then `setInterval` repeats until the range reaches `10`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "pick-console-output",
    snippetId: "168b9458-41cf-4779-b4c3-bd6bed6b3b50",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'console.log(pick({ a: 1, b: 2, c: 3 }, ["a", "c"]));',
    order: 1,
    options: [
      {
        label: '{"b":2}',
        feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
        isCorrect: false,
        order: 1,
      },
      {
        label: '{"a":1,"b":2,"c":3}',
        feedback: 'Not quite. The output is `{"a":1,"c":3}`.',
        isCorrect: false,
        order: 2,
      },
      {
        label: '{"a":1,"c":3}',
        feedback:
          'Correct. The snippet returns a new object containing only selected existing keys, so the output is `{"a":1,"c":3}`.',
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "pop-console-output",
    snippetId: "c4dce4b3-1435-4d35-9384-d722ceae0000",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1, 2];\r\nconsole.log(values.customPop());\r\nconsole.log(values);",
    order: 1,
    options: [
      {
        label: "1, then [2]",
        feedback: "Not quite. The output is `2, then [1]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "2, then [1,2]",
        feedback: "Not quite. The output is `2, then [1]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "2, then [1]",
        feedback:
          "Correct. The snippet removes the last array element by shortening length and returns the removed value, so the output is `2, then [1]`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-all-and-the-event-loop-console-output",
    snippetId: "86e435da-37f1-444e-91b2-598d63d9637c",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: '{ values: [3, "foo", 42] } before { values3: [3, 42] }',
        feedback:
          '`values3` depends only on an already resolved promise and a plain value, so it resolves before the Promise.all that waits for `"foo"`.',
        isCorrect: false,
        order: 1,
      },
      {
        label:
          "the queue is now empty before the initial { p3 } and { p4 } logs",
        feedback:
          "The initial `{ p3 }` and `{ p4 }` logs are part of the current script, so they happen before the timer callback.",
        isCorrect: false,
        order: 2,
      },
      {
        label:
          "{ p3: Promise { [] } }, { p4: Promise { <pending> } }, { values3: [3, 42] }, timer logs, then delayed values logs",
        feedback:
          "The source notes that non-promise values are treated as resolved, but evaluation still runs asynchronously. The Promise.all containing the 1000 ms timer resolves after that timer.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-all-console-output",
    snippetId: "d1b82fd7-ec84-4047-a662-0fd55113a01d",
    topicSlug: "promises",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: 'second, first, third, then ["first", "second", "third"]',
        feedback:
          "Correct. The inner handlers log values as each timer resolves, but the final result array preserves the original input order.",
        isCorrect: true,
        order: 1,
      },
      {
        label: 'first, second, third, then ["first", "second", "third"]',
        feedback:
          'Not quite. The `"second"` promise resolves first because its timer is shorter.',
        isCorrect: false,
        order: 2,
      },
      {
        label: '["first", "second", "third"] only',
        feedback:
          "Not quite. The helper also logs each individual resolved value before logging the final array.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-all-edge-console-output",
    snippetId: "d1b82fd7-ec84-4047-a662-0fd55113a01d",
    topicSlug: "promises",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "myPromiseAll([]).then((values) => console.log(JSON.stringify(values)));",
    order: 2,
    options: [
      {
        label: "undefined",
        feedback:
          "Not quite. The helper explicitly resolves empty input with an empty array.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[] only",
        feedback:
          "Not quite. The reusable snippet is still running, so its delayed promises print after the edge-case `[]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: '[], second, first, third, then ["first", "second", "third"]',
        feedback:
          "Correct. The empty edge case logs `[]` first, then the reusable snippet's pending timers resolve and print their values.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-allsettled-console-output",
    snippetId: "da4c4ef3-9500-41f6-aed6-df3f10f9ff2b",
    topicSlug: "promises",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: 'fulfilled 1, rejected Error("Whoops!"), fulfilled 3',
        feedback:
          "Correct. The reusable snippet logs the full allSettled result array after all three delayed inputs settle.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "fulfilled,rejected",
        feedback:
          "Not quite. That summarizes part of the statuses, but the snippet logs the full result objects including values and the error.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "rejected,fulfilled",
        feedback:
          "Not quite. `allSettled` preserves the original input order and includes three result objects.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-allsettled-edge-console-output",
    snippetId: "da4c4ef3-9500-41f6-aed6-df3f10f9ff2b",
    topicSlug: "promises",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "Promise.customAllSettled([42]).then((result) => console.log(result[0].value));",
    order: 2,
    options: [
      {
        label: "42 only",
        feedback:
          "Not quite. The reusable snippet's delayed allSettled call also prints after the edge-case value.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "fulfilled",
        feedback:
          "Not quite. The challenge logs the value, and the reusable snippet still logs its own result later.",
        isCorrect: false,
        order: 2,
      },
      {
        label: '42, then fulfilled 1, rejected Error("Whoops!"), fulfilled 3',
        feedback:
          "Correct. The edge case logs `42` first, then the reusable snippet logs its delayed allSettled result array.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-any-console-output",
    snippetId: "a93d31e7-9476-4827-bbd8-86032b796a37",
    topicSlug: "promises",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "quick",
        feedback:
          'Correct. The rejection is ignored because Promise.any waits for the first fulfillment, and the `"quick"` promise fulfills before `"slow"`.',
        isCorrect: true,
        order: 1,
      },
      {
        label: "AggregateError",
        feedback:
          'AggregateError is only used when every input rejects. Here the `"quick"` promise fulfills.',
        isCorrect: false,
        order: 2,
      },
      {
        label: "slow",
        feedback:
          'Not quite. `"quick"` settles first, so `"slow"` does not win.',
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-any-edge-console-output",
    snippetId: "a93d31e7-9476-4827-bbd8-86032b796a37",
    topicSlug: "promises",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: 'Promise.customAny([Promise.reject("a"), Promise.reject("b")]).catch((error) => console.log(error.message));',
    order: 2,
    options: [
      {
        label: "All promises were rejected",
        feedback:
          "Not quite. That message prints, but the reusable snippet later prints `quick` too.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "a",
        feedback:
          "Promise.any collects all rejection reasons instead of printing the first one directly.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "All promises were rejected, then quick",
        feedback:
          'Correct. The edge-case rejection is handled before the reusable snippet\'s delayed `"quick"` fulfillment prints.',
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-chaining-and-microtask-queue-order-console-output",
    snippetId: "d770bbff-2d9e-490d-8a23-483ad190b10b",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "3, 4, 1, 2",
        feedback:
          "The first chain is registered first, so its first handler prints before the second chain's first handler.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "1, 2, 3, 4",
        feedback:
          "`promise1`'s second handler is queued only after its first handler runs, so `promise2`'s first handler runs before it.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "1, 3, 2, 4",
        feedback:
          "The source explains that each chained `.then()` schedules its next link only after its own handler runs, so the two chains interleave.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-lifecycle-and-event-loop-timing-console-output",
    snippetId: "4aa3db11-2148-4c6f-9d75-570fc6c5f2ec",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "Promise callback (.then) resolved, then Promise callback",
        feedback:
          "The executor is the first part of the Promise to run; `.then()` cannot run before it.",
        isCorrect: false,
        order: 1,
      },
      {
        label:
          "Promise callback, Promise callback end, Promise (pending) ..., Promise callback (.then) resolved, event-loop cycle: Promise (fulfilled) ...",
        feedback:
          "The source explains that the executor runs immediately, `.then()` runs after the current stack, and the timer runs after promise microtasks.",
        isCorrect: true,
        order: 2,
      },
      {
        label:
          "event-loop cycle: Promise (fulfilled) ... before Promise callback (.then) resolved",
        feedback: "Promise microtasks run before zero-delay timer callbacks.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "promise-race-console-output",
    snippetId: "4e9b8d67-22bc-47d5-aa8c-ff082bfdfe18",
    topicSlug: "promises",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "1",
        feedback:
          "Correct. The first timer resolves with `1` before the later rejection and the later `3` resolution can settle the race.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "Error: Whoops!",
        feedback:
          "Not quite. The rejection is scheduled later than the promise that resolves with `1`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "3",
        feedback:
          "Not quite. The `3` promise resolves last, so it cannot win the race.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "push-console-output",
    snippetId: "685e115c-ed27-40a2-85fe-194e102101a5",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1];\r\nconsole.log(values.customPush(2, 3));\r\nconsole.log(values);",
    order: 1,
    options: [
      {
        label: "2, then [1,2,3]",
        feedback: "Not quite. The output is `3, then [1,2,3]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "3, then [1,2,3]",
        feedback:
          "Correct. The snippet appends each argument to an array and returns the updated length, so the output is `3, then [1,2,3]`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "[1,2,3], then 3",
        feedback: "Not quite. The output is `3, then [1,2,3]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "reduce-console-output",
    snippetId: "5fac89da-a848-44b0-bea1-ec462e98ac76",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 2, 3].customReduce((sum, n) => sum + n, 10));",
    order: 1,
    options: [
      {
        label: "10",
        feedback: "Not quite. The output is `16`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "6",
        feedback: "Not quite. The output is `16`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "16",
        feedback:
          "Correct. The snippet accumulates array values with an optional initial accumulator, so the output is `16`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "reduce-edge-console-output",
    snippetId: "5fac89da-a848-44b0-bea1-ec462e98ac76",
    topicSlug: "array-methods",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "console.log([2, 3, 4].customReduce((product, n) => product * n));",
    order: 2,
    options: [
      {
        label: "24",
        feedback:
          "Correct. This follows the same implementation, so the output is `24`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "0",
        feedback: "Not quite. This edge case outputs `24`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "9",
        feedback: "Not quite. This edge case outputs `24`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "reducer-console-output",
    snippetId: "8a1692ca-34ae-4848-8454-9368a851b879",
    topicSlug: "random",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label:
          '[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall pic", done: false }]',
        feedback:
          "Not quite. The final `changed` action updates task `3` to `Lennon Wall` with `done: true`.",
        isCorrect: false,
        order: 1,
      },
      {
        label:
          '[{ id: 1, text: "Visit Kafka Museum", done: false }, { id: 3, text: "Lennon Wall", done: true }]',
        feedback:
          "Not quite. The task with id `1` is deleted before the final state is logged.",
        isCorrect: false,
        order: 2,
      },
      {
        label:
          '[{ id: 2, text: "Watch a puppet show", done: false }, { id: 3, text: "Lennon Wall", done: true }]',
        feedback:
          "Correct. The snippet logs the final state array, including the remaining task and the changed task.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "requestanimationframe-and-task-ordering-console-output",
    snippetId: "928cc327-b67a-4e16-bdca-1243e654d020",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label: "1, 6, 7, 4, 2, 3, 5",
        feedback:
          "`requestAnimationFrame` does not run as soon as it is registered; it waits for the frame phase.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "1, 6, 4, 2, 3, 5, 7",
        feedback:
          "The source states that promise microtasks run before macrotasks, and `requestAnimationFrame` is queued before the next paint after the other queues are cleared.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "1, 2, 3, 4, 5, 6, 7",
        feedback:
          "The synchronous `6` prints before any queued callback, and the promise callback `4` runs before the timer callback `2`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "reverse-console-output",
    snippetId: "0f359057-08ed-4f8f-becc-c591e5c0fd6c",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1, 2, 3];\r\nconsole.log(values.customReverse());",
    order: 1,
    options: [
      {
        label: "[2,1,3]",
        feedback: "Not quite. The output is `[3,2,1]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[1,2,3]",
        feedback: "Not quite. The output is `[3,2,1]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[3,2,1]",
        feedback:
          "Correct. The snippet swaps elements from both ends of an array to reverse it in place, so the output is `[3,2,1]`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "script-microtasks-and-macrotasks-in-execution-order-console-output",
    snippetId: "61557457-4b82-46ab-a1cf-f8b5d79bb1ff",
    topicSlug: "event-loop",
    title: "Predict the console output",
    prompt: "What does the snippet print?",
    code: null,
    order: 1,
    options: [
      {
        label:
          "Script start, Script end, Promise constructor, After Promise constructor, Promise 1, Promise constructor resolve, Microtask queue, Promise 2, setTimeout",
        feedback:
          "The source summarizes the rule: synchronous code runs first, then promise and queued microtasks, then timer macrotasks.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "Script start, setTimeout, Script end, Promise 1, Promise 2",
        feedback:
          "The zero-delay timer is a macrotask, so it waits until after the current script and microtasks.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "Promise 1, Promise 2, Script start, Script end, setTimeout",
        feedback:
          "Promise callbacks do not run before the current script reaches the end.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "shift-console-output",
    snippetId: "5e39e7ad-3c52-4bd0-b0c6-07e25fcdfa95",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1, 2, 3];\r\nconsole.log(values.customShift());\r\nconsole.log(values);",
    order: 1,
    options: [
      {
        label: "1, then [1,2,3]",
        feedback: "Not quite. The output is `1, then [2,3]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "3, then [1,2]",
        feedback: "Not quite. The output is `1, then [2,3]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "1, then [2,3]",
        feedback:
          "Correct. The snippet removes the first array element by shifting remaining values left, so the output is `1, then [2,3]`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "slice-console-output",
    snippetId: "c36a85ee-626f-4442-9752-ed56e2e207ee",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customSlice(1, -1));\r\nconsole.log(values);",
    order: 1,
    options: [
      {
        label: "[2,3], then [1,2,3,4]",
        feedback:
          "Correct. The snippet copies a normalized index range into a new array without mutating the source, so the output is `[2,3], then [1,2,3,4]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "[1,2,3], then [1,2,3,4]",
        feedback: "Not quite. The output is `[2,3], then [1,2,3,4]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[2,3], then [2,3]",
        feedback: "Not quite. The output is `[2,3], then [1,2,3,4]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "some-console-output",
    snippetId: "9797e6bf-4c33-4c61-b342-e375dd5f944f",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log([1, 3, 4].customSome((n) => n % 2 === 0));",
    order: 1,
    options: [
      {
        label: "[false,false,true]",
        feedback:
          "Not quite. `some` returns one boolean, not the callback result for every item.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "true",
        feedback:
          "Correct. The snippet checks whether at least one array item satisfies a predicate callback, so the output is `true`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "false",
        feedback:
          "Not quite. The callback returns true for `4`, so `customSome` stops with true.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "splice-console-output",
    snippetId: "59b5106c-44a9-4c99-a2e4-d9804ee3374e",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const values = [1, 2, 3, 4];\r\nconsole.log(values.customSplice(1, 2, "a", "b"));\r\nconsole.log(values);',
    order: 1,
    options: [
      {
        label: '[2,3], then [1,4,"a","b"]',
        feedback: 'Not quite. The output is `[2,3], then [1,"a","b",4]`.',
        isCorrect: false,
        order: 1,
      },
      {
        label: '[2,3], then [1,"a","b",4]',
        feedback:
          'Correct. The snippet normalizes splice arguments, removes a segment, inserts new items, and returns deleted values, so the output is `[2,3], then [1,"a","b",4]`.',
        isCorrect: true,
        order: 2,
      },
      {
        label: '["a","b"], then [1,2,3,4]',
        feedback: 'Not quite. The output is `[2,3], then [1,"a","b",4]`.',
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "splice-edge-console-output",
    snippetId: "59b5106c-44a9-4c99-a2e4-d9804ee3374e",
    topicSlug: "array-methods",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: "const values = [1, 2, 3, 4];\r\nconsole.log(values.customSplice(-2));\r\nconsole.log(values);",
    order: 2,
    options: [
      {
        label: "[3,4], then [1,2,3,4]",
        feedback: "Not quite. This edge case outputs `[3,4], then [1,2]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[3,4], then [1,2]",
        feedback:
          "Correct. This follows the same implementation, so the output is `[3,4], then [1,2]`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "[1,2], then [3,4]",
        feedback: "Not quite. This edge case outputs `[3,4], then [1,2]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "this-console-output",
    snippetId: "7cc44719-cf31-4dda-9fde-b21a239ddd0b",
    topicSlug: "core-concepts",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "[{ age: 20 }, { age: 23 }], then [{ age: 20 }, { age: 23 }]",
        feedback:
          "Correct. The arrow wrapper calls `army.canJoin(user)` as a method, and `customFilter` passes `army` as `thisArg`, so both fixed versions keep the same two users.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "TypeError",
        feedback:
          "Not quite. Passing `army.canJoin` directly would lose `this`, but this snippet logs the fixed calls.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "[], then [{ age: 20 }, { age: 23 }]",
        feedback:
          "Not quite. The snippet logs the two fixed approaches, not the broken unbound callback result.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "this-edge-console-output",
    snippetId: "7cc44719-cf31-4dda-9fde-b21a239ddd0b",
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
  },
  {
    slug: "throttle-console-output",
    snippetId: "a5da8d8d-aa19-4222-934a-8ad8e9f7d0cf",
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
        label:
          "Logged after 0 ms: a, then around 600 ms Logged after ... ms: c",
        feedback:
          "The source contrasts throttle with debounce: throttle allows a call immediately, then blocks further calls until the time window ends.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "topological-sort-console-output",
    snippetId: "b486af0e-3443-4f79-8695-d28393fcd614",
    topicSlug: "random",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: null,
    order: 1,
    options: [
      {
        label: "1,2,3,4,5,6,7,8,9,10",
        feedback:
          "Not quite. Cards with dependencies wait until their dependent ids have already been added.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "3,6,7,8,1,2,4,5,9,10",
        feedback:
          "Correct. The snippet logs the full dependency order produced by the pass-based algorithm.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "6,7,8,3,2,5,1,4,9,10",
        feedback:
          "Not quite. The algorithm scans cards in their original order each pass, so card `3` is added before `6` in the first pass.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "topological-sort-edge-console-output",
    snippetId: "b486af0e-3443-4f79-8695-d28393fcd614",
    topicSlug: "random",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: 'console.log(getOrderedCards([{ id: 1, dependent: [] }, { id: 2, dependent: [1] }]).join(","));',
    order: 2,
    options: [
      {
        label: "3,6,7,8,1,2,4,5,9,10, then 1,2",
        feedback:
          "Correct. The reusable snippet logs the full `cards` order first, then the edge-case code logs `1,2`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "3,6,7,8,1,2,4,5,9,10, then 2,1",
        feedback:
          "Not quite. In the edge case, card `2` depends on `1`, so `1` must appear first.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "1,2 only",
        feedback:
          "Not quite. The reusable snippet logs its larger ordering before this edge-case call runs.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "undirected-path-console-output",
    snippetId: "db88a53f-3adf-4823-adfe-3a0f731b4a5c",
    topicSlug: "graph-traversal",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: 'const edges = [["i", "j"], ["k", "i"], ["m", "k"]];\r\nconsole.log(undirectedPath(edges, "j", "m"));',
    order: 1,
    options: [
      {
        label: "false",
        feedback:
          "Not quite. The undirected edges connect `j -> i -> k -> m`, so a path exists.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "true, then false",
        feedback:
          "Not quite. This challenge performs only one call, and that call returns true.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "true",
        feedback:
          "Correct. The snippet builds an adjacency list and uses a visited set to search an undirected graph, so the output is `true`.",
        isCorrect: true,
        order: 3,
      },
    ],
  },
  {
    slug: "undirected-path-edge-console-output",
    snippetId: "db88a53f-3adf-4823-adfe-3a0f731b4a5c",
    topicSlug: "graph-traversal",
    title: "Predict the edge-case console output",
    prompt: "What does this edge case print?",
    code: 'const edges = [["a", "b"], ["c", "d"]];\r\nconsole.log(undirectedPath(edges, "a", "d"));',
    order: 2,
    options: [
      {
        label: "true",
        feedback:
          "Not quite. `a` and `d` are in separate connected components.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "false",
        feedback:
          "Correct. This follows the same implementation, so the output is `false`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "RangeError",
        feedback:
          "Not quite. The visited set prevents infinite recursion on undirected edges.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "union-console-output",
    snippetId: "b1b57911-b68d-4fc8-837d-f9cc33ecb5c9",
    topicSlug: "lodash",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "console.log(union([1, 2], [2, 3]));",
    order: 1,
    options: [
      {
        label: "[1,2,2,3]",
        feedback: "Not quite. The output is `[1,2,3]`.",
        isCorrect: false,
        order: 1,
      },
      {
        label: "[1,2,3]",
        feedback:
          "Correct. The snippet combines arrays and removes duplicates with Set, so the output is `[1,2,3]`.",
        isCorrect: true,
        order: 2,
      },
      {
        label: "[2]",
        feedback: "Not quite. The output is `[1,2,3]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
  {
    slug: "unshift-console-output",
    snippetId: "c55dbcec-9cad-43ab-858e-e65ff881f339",
    topicSlug: "array-methods",
    title: "Predict the console output",
    prompt: "What does this code print?",
    code: "const values = [3, 4];\r\nconsole.log(values.customUnshift(1, 2));\r\nconsole.log(values);",
    order: 1,
    options: [
      {
        label: "4, then [1,2,3,4]",
        feedback:
          "Correct. The snippet prepends values by shifting existing elements right and returns the new length, so the output is `4, then [1,2,3,4]`.",
        isCorrect: true,
        order: 1,
      },
      {
        label: "2, then [1,2,3,4]",
        feedback: "Not quite. The output is `4, then [1,2,3,4]`.",
        isCorrect: false,
        order: 2,
      },
      {
        label: "4, then [3,4,1,2]",
        feedback: "Not quite. The output is `4, then [1,2,3,4]`.",
        isCorrect: false,
        order: 3,
      },
    ],
  },
];
