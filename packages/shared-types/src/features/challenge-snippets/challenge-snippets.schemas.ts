import { z } from "@hono/zod-openapi";

import {
  type PaginationMeta,
  paginationMetaSchema,
  type PaginationQuery,
  paginationQuerySchema,
} from "../../shared/schemas.js";

export type ChallengeSnippet = {
  id: string;
  slug: string;
  topicSlug: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateChallengeSnippetInput = {
  slug: string;
  topicSlug: string;
  title: string;
  language: string;
  code: string;
};

export type UpdateChallengeSnippetInput = Partial<CreateChallengeSnippetInput>;

export type ChallengeSnippetIdParams = {
  id: string;
};

export type SingleChallengeSnippetResponse = {
  data: ChallengeSnippet;
};

export type ChallengeSnippetListResponse = {
  data: ChallengeSnippet[];
  meta: PaginationMeta;
};

export type ChallengeSnippetListQuery = PaginationQuery & {
  q?: string;
  slug?: string;
  sortBy: "createdAt" | "slug" | "title" | "topicSlug" | "updatedAt";
  sortDirection: "asc" | "desc";
  topicSlug?: string;
};

export type DeleteChallengeSnippetResponse = {
  id: string;
};

export const challengeSnippetSchema: z.ZodType<ChallengeSnippet> = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  topicSlug: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const challengeSnippetMutationBaseSchema = z.object({
  slug: z.string().min(1),
  topicSlug: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
});

export const createChallengeSnippetSchema: z.ZodType<CreateChallengeSnippetInput> =
  challengeSnippetMutationBaseSchema;

export const updateChallengeSnippetSchema: z.ZodType<UpdateChallengeSnippetInput> =
  challengeSnippetMutationBaseSchema.partial();

export const challengeSnippetIdParamsSchema = z.object({
  id: z.uuid(),
});

export const singleChallengeSnippetResponseSchema: z.ZodType<SingleChallengeSnippetResponse> =
  z.object({
    data: challengeSnippetSchema,
  });

export const challengeSnippetListResponseSchema: z.ZodType<ChallengeSnippetListResponse> =
  z.object({
    data: z.array(challengeSnippetSchema),
    meta: paginationMetaSchema,
  });

export const challengeSnippetListQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  sortBy: z
    .enum(["createdAt", "slug", "title", "topicSlug", "updatedAt"])
    .default("topicSlug"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
  topicSlug: z.string().trim().min(1).optional(),
});

export const deleteChallengeSnippetResponseSchema: z.ZodType<DeleteChallengeSnippetResponse> =
  z.object({
    id: z.uuid(),
  });
