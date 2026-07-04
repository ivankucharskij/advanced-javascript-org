import type {
  ChallengeSnippet,
  ChallengeSnippetListQuery,
  CreateChallengeSnippetInput,
  UpdateChallengeSnippetInput,
} from "@repo/shared-types";

import { Prisma, prisma } from "../../lib/prisma.js";

type ChallengeSnippetRecord = Awaited<
  ReturnType<typeof prisma.challengeSnippet.findFirstOrThrow>
>;

const toChallengeSnippet = (
  snippet: ChallengeSnippetRecord,
): ChallengeSnippet => {
  return {
    id: snippet.id,
    slug: snippet.slug,
    topicSlug: snippet.topicSlug,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
  };
};

export const challengeSnippetsRepository = {
  async create(input: CreateChallengeSnippetInput) {
    const snippet = await prisma.challengeSnippet.create({
      data: {
        slug: input.slug,
        topicSlug: input.topicSlug,
        title: input.title,
        language: input.language,
        code: input.code,
      },
    });

    return toChallengeSnippet(snippet);
  },
  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      const snippet = await tx.challengeSnippet.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          _count: {
            select: {
              challenges: true,
            },
          },
        },
      });

      if (!snippet) {
        return {
          id: null,
          isUsed: false,
        };
      }

      if (snippet._count.challenges > 0) {
        return {
          id: snippet.id,
          isUsed: true,
        };
      }

      await tx.challengeSnippet.delete({
        where: {
          id,
        },
      });

      return {
        id: snippet.id,
        isUsed: false,
      };
    });
  },
  findById(id: string) {
    return prisma.challengeSnippet.findUnique({
      where: {
        id,
      },
    });
  },
  findBySlug(slug: string) {
    return prisma.challengeSnippet.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });
  },
  async list(query: ChallengeSnippetListQuery) {
    const where: Prisma.ChallengeSnippetWhereInput = {
      ...(query.slug
        ? {
            slug: {
              contains: query.slug,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.topicSlug
        ? {
            topicSlug: query.topicSlug,
          }
        : {}),
      ...(query.q
        ? {
            OR: [
              {
                title: {
                  contains: query.q,
                  mode: "insensitive",
                },
              },
              {
                code: {
                  contains: query.q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.ChallengeSnippetOrderByWithRelationInput[] = [
      {
        [query.sortBy]: query.sortDirection,
      },
      ...(query.sortBy === "topicSlug"
        ? []
        : [
            {
              topicSlug: "asc" as const,
            },
          ]),
      {
        createdAt: "asc",
      },
      {
        id: "asc",
      },
    ];
    const [total, snippets] = await prisma.$transaction([
      prisma.challengeSnippet.count({
        where,
      }),
      prisma.challengeSnippet.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
        orderBy,
      }),
    ]);

    return {
      data: snippets.map(toChallengeSnippet),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
  async update(id: string, input: UpdateChallengeSnippetInput) {
    const snippet = await prisma.challengeSnippet.update({
      where: {
        id,
      },
      data: {
        slug: input.slug,
        topicSlug: input.topicSlug,
        title: input.title,
        language: input.language,
        code: input.code,
      },
    });

    return toChallengeSnippet(snippet);
  },
  toChallengeSnippet,
};
