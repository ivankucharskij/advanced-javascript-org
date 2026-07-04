import type { GuestSessionSummary } from "@repo/shared-types";

import { prisma } from "../../lib/prisma.js";

type GuestSessionWithProgress = Awaited<
  ReturnType<typeof findGuestSessionWithProgress>
>;

const findGuestSessionWithProgress = (id: string) => {
  return prisma.guestSession.findUnique({
    where: {
      id,
    },
    include: {
      challengeProgress: true,
    },
  });
};

const toSummary = (
  guestSession: NonNullable<GuestSessionWithProgress>,
): GuestSessionSummary => {
  return {
    id: guestSession.id,
    createdAt: guestSession.createdAt.toISOString(),
    updatedAt: guestSession.updatedAt.toISOString(),
    progressCount: guestSession.challengeProgress.length,
    totalAnswered: guestSession.challengeProgress.reduce(
      (total, progress) => total + progress.answeredCount,
      0,
    ),
    needsReviewCount: guestSession.challengeProgress.filter(
      (progress) => progress.needsReview,
    ).length,
  };
};

export const guestSessionsRepository = {
  async discard(id: string) {
    return prisma.$transaction(async (tx) => {
      const guestSession = await tx.guestSession.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      if (!guestSession) {
        return null;
      }

      await tx.challengeProgress.deleteMany({
        where: {
          guestSessionId: id,
        },
      });
      await tx.guestSession.delete({
        where: {
          id,
        },
      });

      return guestSession.id;
    });
  },
  async find(id: string): Promise<GuestSessionSummary | null> {
    const guestSession = await findGuestSessionWithProgress(id);

    return guestSession ? toSummary(guestSession) : null;
  },
  async findOrCreate(id: string | undefined) {
    if (id) {
      const existingGuestSession = await findGuestSessionWithProgress(id);

      if (existingGuestSession) {
        return {
          created: false,
          guestSession: toSummary(existingGuestSession),
        };
      }
    }

    const guestSession = await prisma.guestSession.create({
      data: {},
      include: {
        challengeProgress: true,
      },
    });

    return {
      created: true,
      guestSession: toSummary(guestSession),
    };
  },
  async mergeIntoUser(userId: string, guestSessionId: string | undefined) {
    if (!guestSessionId) {
      return {
        discarded: false,
        guestSessionId: null,
        mergedProgressCount: 0,
      };
    }

    return prisma.$transaction(async (tx) => {
      const guestSession = await tx.guestSession.findUnique({
        where: {
          id: guestSessionId,
        },
        include: {
          challengeProgress: true,
        },
      });

      if (!guestSession) {
        return {
          discarded: false,
          guestSessionId,
          mergedProgressCount: 0,
        };
      }

      for (const guestProgress of guestSession.challengeProgress) {
        const userProgress = await tx.challengeProgress.findUnique({
          where: {
            userId_challengeId: {
              challengeId: guestProgress.challengeId,
              userId,
            },
          },
        });

        if (userProgress) {
          await tx.challengeProgress.update({
            where: {
              id: userProgress.id,
            },
            data: {
              answeredCount:
                userProgress.answeredCount + guestProgress.answeredCount,
              correctCount:
                userProgress.correctCount + guestProgress.correctCount,
              needsReview:
                userProgress.needsReview || guestProgress.needsReview,
            },
          });
        } else {
          await tx.challengeProgress.create({
            data: {
              answeredCount: guestProgress.answeredCount,
              challengeId: guestProgress.challengeId,
              correctCount: guestProgress.correctCount,
              needsReview: guestProgress.needsReview,
              userId,
            },
          });
        }
      }

      await tx.challengeProgress.deleteMany({
        where: {
          guestSessionId,
        },
      });
      await tx.guestSession.delete({
        where: {
          id: guestSessionId,
        },
      });

      return {
        discarded: true,
        guestSessionId,
        mergedProgressCount: guestSession.challengeProgress.length,
      };
    });
  },
};
