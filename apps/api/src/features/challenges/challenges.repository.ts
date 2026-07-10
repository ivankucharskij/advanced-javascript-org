import type {
  Challenge,
  ChallengeAnswerInput,
  ChallengeAnswerResponse,
  ChallengeDashboardResponse,
  ChallengeListQuery,
  ChallengeProgress,
  ChallengeRestartResponse,
  ChallengeSessionMode,
  ChallengeSessionResponse,
  ChallengeWithAnswer,
  CreateChallengeInput,
  UpdateChallengeInput,
} from "@repo/shared-types";

import { Prisma, prisma } from "../../lib/prisma.js";
import type { ChallengePracticeActor } from "./challenges.service.js";

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

type PublicChallengeRecord = NonNullable<
  Awaited<ReturnType<typeof findPublicChallenge>>
>;

const findChallengeById = (id: string) => {
  return prisma.challenge.findUnique({
    where: {
      id,
    },
    include: challengeInclude,
  });
};

const findPublicChallenge = (where: Prisma.ChallengeWhereInput) => {
  return prisma.challenge.findFirst({
    where,
    orderBy: [
      {
        topicSlug: "asc",
      },
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
      {
        id: "asc",
      },
    ],
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
      snippet: {
        select: {
          code: true,
        },
      },
    },
  });
};

const getActorProgressWhere = (
  actor: ChallengePracticeActor,
): Prisma.ChallengeProgressWhereInput => {
  if (actor.userId) {
    return {
      userId: actor.userId,
    };
  }

  return {
    guestSessionId: actor.guestSessionId ?? "",
  };
};

const toChallengeProgress = (
  progress: Pick<
    ChallengeProgress,
    "answeredCount" | "challengeId" | "correctCount" | "needsReview"
  >,
): ChallengeProgress => {
  return {
    challengeId: progress.challengeId,
    needsReview: progress.needsReview,
    answeredCount: progress.answeredCount,
    correctCount: progress.correctCount,
  };
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

const combineRunnableCode = (
  snippetCode: string,
  challengeCode: string | null,
) => {
  if (!challengeCode) {
    return snippetCode;
  }

  return `${snippetCode.trim()}\n\n${challengeCode.trim()}`;
};

const toPublicChallenge = (challenge: PublicChallengeRecord): Challenge => {
  return {
    id: challenge.id,
    snippetId: challenge.snippetId,
    slug: challenge.slug,
    topicSlug: challenge.topicSlug,
    title: challenge.title,
    prompt: challenge.prompt,
    code: combineRunnableCode(challenge.snippet.code, challenge.code),
    order: challenge.order,
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    options: challenge.options.map((option) => ({
      id: option.id,
      label: option.label,
      order: option.order,
    })),
  };
};

export const challengesRepository = {
  async answer(
    actor: ChallengePracticeActor,
    challengeId: string,
    input: ChallengeAnswerInput,
  ): Promise<ChallengeAnswerResponse["data"] | null> {
    return prisma.$transaction(async (tx) => {
      const challenge = await tx.challenge.findUnique({
        where: {
          id: challengeId,
        },
        include: {
          options: true,
        },
      });

      if (!challenge) {
        return null;
      }

      const selectedOption = challenge.options.find(
        (option) => option.id === input.optionId,
      );
      const correctOption = challenge.options.find(
        (option) => option.isCorrect,
      );

      if (!selectedOption || !correctOption) {
        return null;
      }

      const isCorrect = selectedOption.id === correctOption.id;
      const progressUpdate = {
        answeredCount: {
          increment: 1,
        },
        needsReview: !isCorrect,
        ...(isCorrect
          ? {
              correctCount: {
                increment: 1,
              },
            }
          : {}),
      };
      const progressCreate = {
        challengeId,
        answeredCount: 1,
        correctCount: isCorrect ? 1 : 0,
        needsReview: !isCorrect,
      };
      const progress = actor.userId
        ? await tx.challengeProgress.upsert({
            where: {
              userId_challengeId: {
                challengeId,
                userId: actor.userId,
              },
            },
            create: {
              ...progressCreate,
              userId: actor.userId,
            },
            update: progressUpdate,
          })
        : await tx.challengeProgress.upsert({
            where: {
              guestSessionId_challengeId: {
                challengeId,
                guestSessionId: actor.guestSessionId ?? "",
              },
            },
            create: {
              ...progressCreate,
              guestSessionId: actor.guestSessionId ?? "",
            },
            update: progressUpdate,
          });

      return {
        isCorrect,
        correctOptionId: correctOption.id,
        selectedOptionId: selectedOption.id,
        feedback: selectedOption.feedback,
        progress: toChallengeProgress(progress),
      };
    });
  },
  async create(input: CreateChallengeInput) {
    const data = {
      slug: input.slug,
      snippet: {
        connect: {
          id: input.snippetId,
        },
      },
      topicSlug: input.topicSlug,
      title: input.title,
      prompt: input.prompt,
      code: input.code ?? null,
      ...(input.order === undefined ? {} : { order: input.order }),
      options: {
        create: input.options.map((option) => ({
          label: option.label,
          feedback: option.feedback,
          isCorrect: option.isCorrect,
          order: option.order,
        })),
      },
    } as Prisma.ChallengeCreateInput;
    const challenge = await prisma.challenge.create({
      data,
      include: challengeInclude,
    });

    return toChallengeWithAnswer(challenge);
  },
  async dashboard(
    actor: ChallengePracticeActor,
  ): Promise<ChallengeDashboardResponse["data"]> {
    const progressWhere = getActorProgressWhere(actor);
    const [totalChallenges, topicCounts, progress] = await prisma.$transaction([
      prisma.challenge.count(),
      prisma.challenge.groupBy({
        by: ["topicSlug"],
        _count: {
          _all: true,
        },
        orderBy: {
          topicSlug: "asc",
        },
      }),
      prisma.challengeProgress.findMany({
        where: progressWhere,
        include: {
          challenge: {
            select: {
              topicSlug: true,
            },
          },
        },
      }),
    ]);
    const totalAnswerAttempts = progress.reduce(
      (total, item) => total + item.answeredCount,
      0,
    );
    const answeredChallengeCount = progress.filter(
      (item) => item.answeredCount > 0,
    ).length;
    const reviewCount = progress.filter((item) => item.needsReview).length;
    const masteredChallengeCount = progress.filter(
      (item) => item.answeredCount > 0 && !item.needsReview,
    ).length;
    const progressByTopic = new Map<
      string,
      { completed: number; mastered: number }
    >();

    for (const item of progress) {
      const current = progressByTopic.get(item.challenge.topicSlug) ?? {
        completed: 0,
        mastered: 0,
      };

      if (item.answeredCount > 0) {
        current.completed += 1;
      }

      if (item.answeredCount > 0 && !item.needsReview) {
        current.mastered += 1;
      }

      progressByTopic.set(item.challenge.topicSlug, current);
    }

    return {
      greetingName: actor.greetingName,
      answeredToday: 0,
      practiceCount: Math.max(totalChallenges - answeredChallengeCount, 0),
      reviewCount,
      totalAnswered: answeredChallengeCount,
      totalCorrect: masteredChallengeCount,
      totalWrong: reviewCount,
      authRequired: !actor.userId && totalAnswerAttempts >= 50,
      topics: topicCounts.map((topic) => {
        const topicProgress = progressByTopic.get(topic.topicSlug) ?? {
          completed: 0,
          mastered: 0,
        };

        return {
          topicSlug: topic.topicSlug,
          total: topic._count._all,
          completed: topicProgress.completed,
          mastered: topicProgress.mastered,
        };
      }),
    };
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
  async next(
    actor: ChallengePracticeActor,
    mode: ChallengeSessionMode,
  ): Promise<ChallengeSessionResponse["data"]> {
    const progressWhere = getActorProgressWhere(actor);
    const [total, progressSummary] = await prisma.$transaction([
      prisma.challenge.count(),
      prisma.challengeProgress.aggregate({
        where: progressWhere,
        _sum: {
          answeredCount: true,
        },
      }),
    ]);
    const challenge =
      mode === "review"
        ? await findPublicChallenge({
            progress: {
              some: {
                ...progressWhere,
                needsReview: true,
              },
            },
          })
        : await findPublicChallenge({
            NOT: {
              progress: {
                some: {
                  ...progressWhere,
                  answeredCount: {
                    gt: 0,
                  },
                },
              },
            },
          });

    return {
      mode,
      answered: progressSummary._sum.answeredCount ?? 0,
      total,
      challenge: challenge ? toPublicChallenge(challenge) : null,
    };
  },
  async restart(
    actor: ChallengePracticeActor,
  ): Promise<ChallengeRestartResponse["data"]> {
    const result = await prisma.challengeProgress.deleteMany({
      where: getActorProgressWhere(actor),
    });

    return {
      resetCount: result.count,
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

      const data: Prisma.ChallengeUpdateInput = {
        slug: input.slug,
        ...(input.snippetId
          ? {
              snippet: {
                connect: {
                  id: input.snippetId,
                },
              },
            }
          : {}),
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
      };

      return tx.challenge.update({
        where: {
          id,
        },
        data,
        include: challengeInclude,
      });
    });

    return toChallengeWithAnswer(challenge);
  },
  toChallengeWithAnswer,
};
