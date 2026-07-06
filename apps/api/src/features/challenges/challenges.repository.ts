import type {
  ChallengeListQuery,
  ChallengeWithAnswer,
  CreateChallengeInput,
  UpdateChallengeInput,
} from "@repo/shared-types";

import { Prisma, prisma } from "../../lib/prisma.js";

const challengeInclude = {
  options: {
    orderBy: {
      order: "asc" as const,
    },
  },
};

type ChallengeRecord = NonNullable<
  Awaited<ReturnType<typeof findChallengeById>>
>;

const findChallengeById = (id: string) => {
  return prisma.challenge.findUnique({
    where: {
      id,
    },
    include: challengeInclude,
  });
};

const toChallengeWithAnswer = (
  challenge: ChallengeRecord,
): ChallengeWithAnswer => {
  return {
    id: challenge.id,
    snippetId: challenge.snippetId,
    slug: challenge.slug,
    topicSlug: challenge.topicSlug,
    title: challenge.title,
    prompt: challenge.prompt,
    code: challenge.code,
    order: challenge.order,
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    options: challenge.options.map((option) => ({
      id: option.id,
      label: option.label,
      feedback: option.feedback,
      isCorrect: option.isCorrect,
      order: option.order,
    })),
  };
};

export const challengesRepository = {
  async create(input: CreateChallengeInput) {
    const challenge = await prisma.challenge.create({
      data: {
        slug: input.slug,
        snippetId: input.snippetId,
        topicSlug: input.topicSlug,
        title: input.title,
        prompt: input.prompt,
        code: input.code,
        ...(input.order === undefined ? {} : { order: input.order }),
        options: {
          create: input.options.map((option) => ({
            label: option.label,
            feedback: option.feedback,
            isCorrect: option.isCorrect,
            order: option.order,
          })),
        },
      },
      include: challengeInclude,
    });

    return toChallengeWithAnswer(challenge);
  },
  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      const challenge = await tx.challenge.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      if (!challenge) {
        return null;
      }

      await tx.challengeProgress.deleteMany({
        where: {
          challengeId: id,
        },
      });
      await tx.challengeOption.deleteMany({
        where: {
          challengeId: id,
        },
      });
      await tx.challenge.delete({
        where: {
          id,
        },
      });

      return challenge.id;
    });
  },
  findById(id: string) {
    return findChallengeById(id);
  },
  findBySlug(slug: string) {
    return prisma.challenge.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });
  },
  async list(query: ChallengeListQuery) {
    const where: Prisma.ChallengeWhereInput = {
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
      ...(query.snippetId
        ? {
            snippetId: query.snippetId,
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
                prompt: {
                  contains: query.q,
                  mode: "insensitive",
                },
              },
              {
                snippet: {
                  code: {
                    contains: query.q,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.ChallengeOrderByWithRelationInput[] = [
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
      ...(query.sortBy === "order"
        ? []
        : [
            {
              order: "asc" as const,
            },
          ]),
      {
        createdAt: "asc",
      },
      {
        id: "asc",
      },
    ];
    const [total, challenges] = await prisma.$transaction([
      prisma.challenge.count({
        where,
      }),
      prisma.challenge.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
        orderBy,
        include: challengeInclude,
      }),
    ]);

    return {
      data: challenges.map(toChallengeWithAnswer),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
  async update(id: string, input: UpdateChallengeInput) {
    const challenge = await prisma.$transaction(async (tx) => {
      if (input.options) {
        await tx.challengeOption.deleteMany({
          where: {
            challengeId: id,
          },
        });
      }

      return tx.challenge.update({
        where: {
          id,
        },
        data: {
          slug: input.slug,
          snippetId: input.snippetId,
          topicSlug: input.topicSlug,
          title: input.title,
          prompt: input.prompt,
          code: input.code,
          order: input.order,
          ...(input.options
            ? {
                options: {
                  create: input.options.map((option) => ({
                    label: option.label,
                    feedback: option.feedback,
                    isCorrect: option.isCorrect,
                    order: option.order,
                  })),
                },
              }
            : {}),
        },
        include: challengeInclude,
      });
    });

    return toChallengeWithAnswer(challenge);
  },
  toChallengeWithAnswer,
};
