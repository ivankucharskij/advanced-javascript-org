# Concat Challenges

Draft challenge payloads for the `concat` snippet.

The `code` field is only the challenge-specific executable tail. Render or run it by appending it below the reusable `concat` snippet code.

Replace `<concat-snippet-id>` with the UUID from the `concat` `ChallengeSnippet` row before posting through Swagger.

## 1. Concatenates Arrays And Values

```json
{
  "slug": "concat-arrays-and-values",
  "snippetId": "8d25035c-8ac5-4cae-8c55-5d4ed57c6254",
  "topicSlug": "array-methods",
  "title": "Concatenates arrays and individual values",
  "prompt": "What does the final console.log print?",
  "code": "const numbers = [1, 2];\nconst result = numbers.myConcat([3, 4], 5);\nconsole.log(result);",
  "options": [
    {
      "label": "[1, 2, 3, 4, 5]",
      "feedback": "Correct. Array arguments are spread one level and non-array values are appended as-is.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "[1, 2, [3, 4], 5]",
      "feedback": "Not quite. The implementation spreads direct array arguments with result.push(...array).",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "[3, 4, 5]",
      "feedback": "Not quite. The result starts with a shallow copy of the receiver: [...this].",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

## 2. Does Not Deep Flatten

```json
{
  "slug": "concat-does-not-deep-flatten",
  "snippetId": "8d25035c-8ac5-4cae-8c55-5d4ed57c6254",
  "topicSlug": "array-methods",
  "title": "Concat only flattens one argument level",
  "prompt": "Why does the nested array remain nested in the output?",
  "code": "const base = [1];\nconst result = base.myConcat([2, [3]], 4);\nconsole.log(result);",
  "options": [
    {
      "label": "Because only direct array arguments are spread; nested arrays are pushed as elements of that argument.",
      "feedback": "Correct. The spread happens only for the current argument, not recursively for nested arrays.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "Because Array.isArray returns false for nested arrays.",
      "feedback": "Not quite. Array.isArray([3]) is true, but this implementation never checks nested elements recursively.",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "Because the receiver array is frozen before concatenation.",
      "feedback": "Not quite. The receiver is copied with [...this], but freezing is not involved.",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

## 3. Does Not Mutate Receiver

```json
{
  "slug": "concat-does-not-mutate-receiver",
  "snippetId": "8d25035c-8ac5-4cae-8c55-5d4ed57c6254",
  "topicSlug": "array-methods",
  "title": "Concat returns a new array",
  "prompt": "What is logged, and what does it show about the original array?",
  "code": "const source = [\"a\"];\nconst result = source.myConcat([\"b\"], \"c\");\nconsole.log(source, result);",
  "options": [
    {
      "label": "[\"a\"] and [\"a\", \"b\", \"c\"]",
      "feedback": "Correct. The implementation builds result from [...this], so the original array is not mutated.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "[\"a\", \"b\", \"c\"] and [\"a\", \"b\", \"c\"]",
      "feedback": "Not quite. The implementation pushes into result, not into source.",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "[\"b\", \"c\"] and [\"a\", \"b\", \"c\"]",
      "feedback": "Not quite. The source array is copied, not replaced or truncated.",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

# Fill Challenges

Draft challenge payloads for the `fill` snippet.

The `code` field is only the challenge-specific executable tail. Render or run it by appending it below the reusable `fill` snippet code.

Replace `<fill-snippet-id>` with the UUID from the `fill` `ChallengeSnippet` row before posting through Swagger.

## 1. Mutates Range And Returns Array

```json
{
  "slug": "fill-mutates-range-and-returns-array",
  "snippetId": "0d4ebf24-85da-41a3-9388-da6ccd7cdacc",
  "topicSlug": "array-methods",
  "title": "Fill mutates a selected range",
  "prompt": "What does the final console.log print?",
  "code": "const values = [1, 2, 3, 4];\nconst result = values.customFill(0, 1, 3);\nconsole.log(values, result === values);",
  "options": [
    {
      "label": "[1, 0, 0, 4] and true",
      "feedback": "Correct. The method writes into the original array from index 1 up to, but not including, index 3, then returns the same array.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "[1, 0, 0, 0] and true",
      "feedback": "Not quite. The end index is exclusive, so index 3 is not filled.",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "[1, 2, 3, 4] and false",
      "feedback": "Not quite. This implementation mutates the receiver and returns it.",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

## 2. Handles Negative Start

```json
{
  "slug": "fill-handles-negative-start",
  "snippetId": "0d4ebf24-85da-41a3-9388-da6ccd7cdacc",
  "topicSlug": "array-methods",
  "title": "Fill normalizes a negative start index",
  "prompt": "Which indexes are overwritten?",
  "code": "const values = [\"a\", \"b\", \"c\", \"d\"];\nvalues.customFill(\"x\", -2);\nconsole.log(values);",
  "options": [
    {
      "label": "Indexes 2 and 3 are overwritten.",
      "feedback": "Correct. start = this.length + start turns -2 into 2, and the default end is the array length.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "Only index 2 is overwritten.",
      "feedback": "Not quite. With no explicit end, the loop continues until the end of the array.",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "Indexes 0 and 1 are overwritten.",
      "feedback": "Not quite. A negative start is counted from the end of the array.",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

## 3. Handles Negative End

```json
{
  "slug": "fill-handles-negative-end",
  "snippetId": "0d4ebf24-85da-41a3-9388-da6ccd7cdacc",
  "topicSlug": "array-methods",
  "title": "Fill normalizes a negative end index",
  "prompt": "What does the final console.log print?",
  "code": "const values = [1, 2, 3, 4, 5];\nvalues.customFill(9, 1, -1);\nconsole.log(values);",
  "options": [
    {
      "label": "[1, 9, 9, 9, 5]",
      "feedback": "Correct. end = this.length + end turns -1 into 4, and the loop stops before index 4.",
      "isCorrect": true,
      "order": 1
    },
    {
      "label": "[1, 9, 9, 9, 9]",
      "feedback": "Not quite. The end index is exclusive after normalization.",
      "isCorrect": false,
      "order": 2
    },
    {
      "label": "[9, 9, 9, 9, 5]",
      "feedback": "Not quite. Filling starts at index 1, not index 0.",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```
