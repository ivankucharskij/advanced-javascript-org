import type {
  PracticeAnswerResponse,
  PracticeChallenge,
  PracticeDashboardResponse,
  PracticeNextChallengeResponse,
} from "@repo/shared-types";

const concatSnippet = `Array.prototype.myConcat = function (...arrays) {
  const result = [...this];

  for (const array of arrays) {
    if (Array.isArray(array)) {
      result.push(...array);
    } else {
      result.push(array);
    }
  }

  return result;
};`;

const fillSnippet = `Array.prototype.customFill = function (value, start = 0, end = this.length) {
  if (start < 0) {
    start = this.length + start;
  }

  if (end < 0) {
    end = this.length + end;
  }

  for (let i = start; i < Math.min(end, this.length); i++) {
    this[i] = value;
  }

  return this;
};`;

export const mockPracticeDashboard: PracticeDashboardResponse = {
  data: {
    greetingName: null,
    practiceCount: 4,
    reviewCount: 2,
    totalAnswered: 18,
    totalCorrect: 12,
    totalWrong: 6,
    authRequired: false,
    topics: [
      {
        topicSlug: "array-methods",
        total: 6,
        completed: 2,
        mastered: 1,
      },
    ],
  },
};

export const mockPracticeChallenges: PracticeChallenge[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "concat-arrays-and-values",
    topicSlug: "array-methods",
    prompt: "What does the final console.log print?",
    language: "js",
    code: `${concatSnippet}

const numbers = [1, 2];
const result = numbers.myConcat([3, 4], 5);
console.log(result);`,
    options: [
      {
        id: "11111111-1111-4111-8111-111111111101",
        label: "[1, 2, 3, 4, 5]",
        order: 1,
      },
      {
        id: "11111111-1111-4111-8111-111111111102",
        label: "[1, 2, [3, 4], 5]",
        order: 2,
      },
      {
        id: "11111111-1111-4111-8111-111111111103",
        label: "[3, 4, 5]",
        order: 3,
      },
    ],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "fill-handles-negative-start",
    topicSlug: "array-methods",
    prompt: "Which indexes are overwritten?",
    language: "js",
    code: `${fillSnippet}

const values = ["a", "b", "c", "d"];
values.customFill("x", -2);
console.log(values);`,
    options: [
      {
        id: "22222222-2222-4222-8222-222222222201",
        label: "Indexes 2 and 3 are overwritten.",
        order: 1,
      },
      {
        id: "22222222-2222-4222-8222-222222222202",
        label: "Only index 2 is overwritten.",
        order: 2,
      },
      {
        id: "22222222-2222-4222-8222-222222222203",
        label: "Indexes 0 and 1 are overwritten.",
        order: 3,
      },
    ],
  },
];

export const mockPracticeNextResponse: PracticeNextChallengeResponse = {
  data: {
    mode: "practice",
    answered: 2,
    total: 6,
    challenge: mockPracticeChallenges[0] ?? null,
  },
};

export const mockPracticeAnswers: Record<string, PracticeAnswerResponse> = {
  "11111111-1111-4111-8111-111111111101": {
    data: {
      isCorrect: true,
      correctOptionId: "11111111-1111-4111-8111-111111111101",
      selectedOptionId: "11111111-1111-4111-8111-111111111101",
      feedback:
        "Correct. Array arguments are spread one level and non-array values are appended as-is.",
      progress: {
        challengeId: "11111111-1111-4111-8111-111111111111",
        needsReview: false,
        answeredCount: 3,
        correctCount: 2,
      },
    },
  },
  "11111111-1111-4111-8111-111111111102": {
    data: {
      isCorrect: false,
      correctOptionId: "11111111-1111-4111-8111-111111111101",
      selectedOptionId: "11111111-1111-4111-8111-111111111102",
      feedback:
        "Not quite. The implementation spreads direct array arguments with result.push(...array).",
      progress: {
        challengeId: "11111111-1111-4111-8111-111111111111",
        needsReview: true,
        answeredCount: 3,
        correctCount: 1,
      },
    },
  },
  "11111111-1111-4111-8111-111111111103": {
    data: {
      isCorrect: false,
      correctOptionId: "11111111-1111-4111-8111-111111111101",
      selectedOptionId: "11111111-1111-4111-8111-111111111103",
      feedback:
        "Not quite. The result starts with a shallow copy of the receiver: [...this].",
      progress: {
        challengeId: "11111111-1111-4111-8111-111111111111",
        needsReview: true,
        answeredCount: 3,
        correctCount: 1,
      },
    },
  },
  "22222222-2222-4222-8222-222222222201": {
    data: {
      isCorrect: true,
      correctOptionId: "22222222-2222-4222-8222-222222222201",
      selectedOptionId: "22222222-2222-4222-8222-222222222201",
      feedback:
        "Correct. start = this.length + start turns -2 into 2, and the default end is the array length.",
      progress: {
        challengeId: "22222222-2222-4222-8222-222222222222",
        needsReview: false,
        answeredCount: 2,
        correctCount: 2,
      },
    },
  },
  "22222222-2222-4222-8222-222222222202": {
    data: {
      isCorrect: false,
      correctOptionId: "22222222-2222-4222-8222-222222222201",
      selectedOptionId: "22222222-2222-4222-8222-222222222202",
      feedback:
        "Not quite. With no explicit end, the loop continues until the end of the array.",
      progress: {
        challengeId: "22222222-2222-4222-8222-222222222222",
        needsReview: true,
        answeredCount: 2,
        correctCount: 1,
      },
    },
  },
  "22222222-2222-4222-8222-222222222203": {
    data: {
      isCorrect: false,
      correctOptionId: "22222222-2222-4222-8222-222222222201",
      selectedOptionId: "22222222-2222-4222-8222-222222222203",
      feedback: "Not quite. A negative start is counted from the end of the array.",
      progress: {
        challengeId: "22222222-2222-4222-8222-222222222222",
        needsReview: true,
        answeredCount: 2,
        correctCount: 1,
      },
    },
  },
};
