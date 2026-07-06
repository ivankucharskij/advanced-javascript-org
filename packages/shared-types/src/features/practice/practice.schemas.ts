import { z } from "@hono/zod-openapi";

import {
  type ChallengeProgress,
  challengeProgressSchema,
} from "../challenges/challenges.schemas.js";

export type PracticeSessionMode = "practice" | "review";

export type PracticeOption = {
  id: string;
  label: string;
  order: number;
};

export type PracticeChallenge = {
  id: string;
  slug: string;
  topicSlug: string;
  prompt: string;
  language: string;
  code: string;
  options: PracticeOption[];
};

export type PracticeDashboardResponse = {
  data: {
    greetingName: string | null;
    practiceCount: number;
    reviewCount: number;
    totalAnswered: number;
    totalCorrect: number;
    totalWrong: number;
    authRequired: boolean;
    topics: Array<{
      topicSlug: string;
      total: number;
      completed: number;
      mastered: number;
    }>;
  };
};

export type PracticeNextChallengeQuery = {
  mode: PracticeSessionMode;
};

export type PracticeNextChallengeResponse = {
  data: {
    mode: PracticeSessionMode;
    answered: number;
    total: number;
    challenge: PracticeChallenge | null;
  };
};

export type PracticeAnswerInput = {
  optionId: string;
};

export type PracticeAnswerResponse = {
  data: {
    isCorrect: boolean;
    correctOptionId: string;
    selectedOptionId: string;
    feedback: string;
    progress: ChallengeProgress;
  };
};

export const practiceSessionModeSchema: z.ZodType<PracticeSessionMode> =
  z.enum(["practice", "review"]);

export const practiceOptionSchema: z.ZodType<PracticeOption> = z.object({
  id: z.uuid(),
  label: z.string().min(1),
  order: z.number().int(),
});

export const practiceChallengeSchema: z.ZodType<PracticeChallenge> = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  topicSlug: z.string().min(1),
  prompt: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
  options: z.array(practiceOptionSchema).length(3),
});

export const practiceDashboardResponseSchema: z.ZodType<PracticeDashboardResponse> =
  z.object({
    data: z.object({
      greetingName: z.string().nullable(),
      practiceCount: z.number().int().min(0),
      reviewCount: z.number().int().min(0),
      totalAnswered: z.number().int().min(0),
      totalCorrect: z.number().int().min(0),
      totalWrong: z.number().int().min(0),
      authRequired: z.boolean(),
      topics: z.array(
        z.object({
          topicSlug: z.string().min(1),
          total: z.number().int().min(0),
          completed: z.number().int().min(0),
          mastered: z.number().int().min(0),
        }),
      ),
    }),
  });

export const practiceNextChallengeQuerySchema = z.object({
  mode: practiceSessionModeSchema.default("practice"),
});

export const practiceNextChallengeResponseSchema: z.ZodType<PracticeNextChallengeResponse> =
  z.object({
    data: z.object({
      mode: practiceSessionModeSchema,
      answered: z.number().int().min(0),
      total: z.number().int().min(0),
      challenge: practiceChallengeSchema.nullable(),
    }),
  });

export const practiceAnswerSchema: z.ZodType<PracticeAnswerInput> = z.object({
  optionId: z.uuid(),
});

export const practiceAnswerResponseSchema: z.ZodType<PracticeAnswerResponse> =
  z.object({
    data: z.object({
      isCorrect: z.boolean(),
      correctOptionId: z.uuid(),
      selectedOptionId: z.uuid(),
      feedback: z.string().min(1),
      progress: challengeProgressSchema,
    }),
  });
