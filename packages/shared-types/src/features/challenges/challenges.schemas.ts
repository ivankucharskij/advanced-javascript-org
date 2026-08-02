import { z } from "@hono/zod-openapi";

import {
  type PaginationMeta,
  paginationMetaSchema,
  type PaginationQuery,
  paginationQuerySchema,
} from "../../shared/schemas.js";

export type ChallengeSessionMode = "practice" | "review";

export type ChallengeOption = {
  id: string;
  label: string;
  order: number;
};

export type ChallengeOptionWithAnswer = ChallengeOption & {
  feedback: string;
  isCorrect: boolean;
};

export type Challenge = {
  id: string;
  snippetId: string;
  slug: string;
  topicSlug: string;
  title: string;
  prompt: string;
  code: string | null;
  order: number;
  options: ChallengeOption[];
  createdAt: string;
  updatedAt: string;
};

export type ChallengeWithAnswer = Omit<Challenge, "options"> & {
  options: ChallengeOptionWithAnswer[];
};

export type CreateChallengeOptionInput = {
  label: string;
  feedback: string;
  isCorrect: boolean;
  order: number;
};

export type CreateChallengeInput = {
  slug: string;
  snippetId: string;
  topicSlug: string;
  title: string;
  prompt: string;
  code?: string | null;
  order: number;
  options: CreateChallengeOptionInput[];
};

export type UpdateChallengeInput = Partial<
  Omit<CreateChallengeInput, "options">
> & {
  options?: CreateChallengeOptionInput[];
};

export type ChallengeIdParams = {
  id: string;
};

export type ChallengeAnswerInput = {
  optionId: string;
};

export type ChallengeAnswerResponse = {
  data: {
    isCorrect: boolean;
    correctOptionId: string;
    selectedOptionId: string;
    feedback: string;
    progress: ChallengeProgress;
  };
};

export type ChallengeProgress = {
  challengeId: string;
  needsReview: boolean;
  answeredCount: number;
  correctCount: number;
};

export type ChallengeDashboardResponse = {
  data: {
    greetingName: string | null;
    answeredToday: number;
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

export type ChallengeSessionQuery = {
  mode: ChallengeSessionMode;
};

export type ChallengeSessionResponse = {
  data: {
    mode: ChallengeSessionMode;
    answered: number;
    total: number;
    challenge: Challenge | null;
  };
};

export type ChallengeRestartResponse = {
  data: {
    resetCount: number;
  };
};

export type SingleChallengeResponse = {
  data: ChallengeWithAnswer;
};

export type ChallengeListResponse = {
  data: ChallengeWithAnswer[];
  meta: PaginationMeta;
};

export type ChallengeListQuery = PaginationQuery & {
  q?: string;
  slug?: string;
  snippetId?: string;
  sortBy: "createdAt" | "order" | "slug" | "title" | "topicSlug" | "updatedAt";
  sortDirection: "asc" | "desc";
  topicSlug?: string;
};

export type DeleteChallengeResponse = {
  id: string;
};

export const challengeSessionModeSchema: z.ZodType<ChallengeSessionMode> =
  z.enum(["practice", "review"]);

export const challengeOptionSchema: z.ZodType<ChallengeOption> = z.object({
  id: z.uuid(),
  label: z.string().min(1),
  order: z.number().int(),
});

export const challengeOptionWithAnswerSchema: z.ZodType<ChallengeOptionWithAnswer> =
  z.object({
    id: z.uuid(),
    label: z.string().min(1),
    order: z.number().int(),
    feedback: z.string().min(1),
    isCorrect: z.boolean(),
  });

export const challengeSchema: z.ZodType<Challenge> = z.object({
  id: z.uuid(),
  snippetId: z.uuid(),
  slug: z.string().min(1),
  topicSlug: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  code: z.string().min(1).nullable(),
  order: z.number().int(),
  options: z.array(challengeOptionSchema).length(3),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const challengeWithAnswerSchema: z.ZodType<ChallengeWithAnswer> =
  z.object({
    id: z.uuid(),
    snippetId: z.uuid(),
    slug: z.string().min(1),
    topicSlug: z.string().min(1),
    title: z.string().min(1),
    prompt: z.string().min(1),
    code: z.string().min(1).nullable(),
    order: z.number().int(),
    options: z.array(challengeOptionWithAnswerSchema).length(3),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  });

export const createChallengeOptionSchema: z.ZodType<CreateChallengeOptionInput> =
  z.object({
    label: z.string().min(1),
    feedback: z.string().min(1),
    isCorrect: z.boolean(),
    order: z.number().int(),
  });

const challengeMutationBaseSchema = z.object({
  slug: z.string().min(1),
  snippetId: z.uuid(),
  topicSlug: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  code: z.string().min(1).nullable().optional(),
  order: z.number().int(),
  options: z.array(createChallengeOptionSchema).length(3),
});

export const createChallengeSchema: z.ZodType<CreateChallengeInput> =
  challengeMutationBaseSchema.refine(
    (input) => input.options.filter((option) => option.isCorrect).length === 1,
    {
      message: "Exactly one option must be correct",
      path: ["options"],
    },
  );

export const updateChallengeSchema: z.ZodType<UpdateChallengeInput> =
  challengeMutationBaseSchema.partial().refine(
    (input) => {
      if (!input.options) {
        return true;
      }

      return input.options.filter((option) => option.isCorrect).length === 1;
    },
    {
      message: "Exactly one option must be correct",
      path: ["options"],
    },
  );

export const challengeIdParamsSchema = z.object({
  id: z.uuid(),
});

export const challengeAnswerSchema: z.ZodType<ChallengeAnswerInput> = z.object({
  optionId: z.uuid(),
});

export const challengeProgressSchema: z.ZodType<ChallengeProgress> = z.object({
  challengeId: z.uuid(),
  needsReview: z.boolean(),
  answeredCount: z.number().int().min(0),
  correctCount: z.number().int().min(0),
});

export const challengeAnswerResponseSchema: z.ZodType<ChallengeAnswerResponse> =
  z.object({
    data: z.object({
      isCorrect: z.boolean(),
      correctOptionId: z.uuid(),
      selectedOptionId: z.uuid(),
      feedback: z.string().min(1),
      progress: challengeProgressSchema,
    }),
  });

export const challengeDashboardResponseSchema: z.ZodType<ChallengeDashboardResponse> =
  z.object({
    data: z.object({
      greetingName: z.string().nullable(),
      answeredToday: z.number().int().min(0),
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

export const challengeSessionQuerySchema = z.object({
  mode: challengeSessionModeSchema.default("practice"),
});

export const challengeSessionResponseSchema: z.ZodType<ChallengeSessionResponse> =
  z.object({
    data: z.object({
      mode: challengeSessionModeSchema,
      answered: z.number().int().min(0),
      total: z.number().int().min(0),
      challenge: challengeSchema.nullable(),
    }),
  });

export const challengeRestartResponseSchema: z.ZodType<ChallengeRestartResponse> =
  z.object({
    data: z.object({
      resetCount: z.number().int().min(0),
    }),
  });

export const singleChallengeResponseSchema: z.ZodType<SingleChallengeResponse> =
  z.object({
    data: challengeWithAnswerSchema,
  });

export const challengeListResponseSchema: z.ZodType<ChallengeListResponse> =
  z.object({
    data: z.array(challengeWithAnswerSchema),
    meta: paginationMetaSchema,
  });

export const challengeListQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  snippetId: z.uuid().optional(),
  sortBy: z
    .enum(["createdAt", "order", "slug", "title", "topicSlug", "updatedAt"])
    .default("topicSlug"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
  topicSlug: z.string().trim().min(1).optional(),
});

export const deleteChallengeResponseSchema: z.ZodType<DeleteChallengeResponse> =
  z.object({
    id: z.uuid(),
  });
