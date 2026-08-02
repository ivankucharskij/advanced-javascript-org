import { randomUUID } from "node:crypto";

import type { GuestSessionSummary } from "@repo/shared-types";
import type { SQL } from "@ydbjs/query";

import { getDb } from "../../lib/db.js";
import { toIsoDate, toNumber } from "../../lib/db-utils.js";
import {
  deleteGuestProgress,
  deleteGuestSession,
  type GuestSessionRow,
  insertGuestSession,
  insertUserProgressFromGuest,
  selectGuestProgress,
  selectGuestProgressSummary,
  selectGuestSession,
  selectUserProgress,
  updateUserProgressFromGuest,
} from "./guest-sessions.sql.js";

const toSummary = async (
  sql: SQL,
  guestSession: GuestSessionRow,
): Promise<GuestSessionSummary> => {
  const progress = await selectGuestProgressSummary(sql, guestSession.id);

  return {
    id: guestSession.id,
    createdAt: toIsoDate(guestSession.created_at),
    updatedAt: toIsoDate(guestSession.updated_at),
    progressCount: toNumber(progress?.progress_count),
    totalAnswered: toNumber(progress?.total_answered),
    needsReviewCount: toNumber(progress?.needs_review_count),
  };
};

export const guestSessionsRepository = {
  async discard(id: string) {
    const sql = await getDb();

    return sql.begin(async (tx) => {
      const guestSession = await selectGuestSession(tx, id);

      if (!guestSession) {
        return null;
      }

      await deleteGuestProgress(tx, id);
      await deleteGuestSession(tx, id);

      return guestSession.id;
    });
  },
  async find(id: string): Promise<GuestSessionSummary | null> {
    const sql = await getDb();
    const guestSession = await selectGuestSession(sql, id);

    return guestSession ? toSummary(sql, guestSession) : null;
  },
  async findOrCreate(id: string | undefined) {
    const sql = await getDb();

    if (id) {
      const existingGuestSession = await selectGuestSession(sql, id);

      if (existingGuestSession) {
        return {
          created: false,
          guestSession: await toSummary(sql, existingGuestSession),
        };
      }
    }

    const guestSessionId = randomUUID();

    await insertGuestSession(sql, guestSessionId);

    const guestSession = await selectGuestSession(sql, guestSessionId);

    if (!guestSession) {
      throw new Error("Database guest session create did not return a session");
    }

    return {
      created: true,
      guestSession: await toSummary(sql, guestSession),
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

    const sql = await getDb();

    return sql.begin(async (tx) => {
      const guestSession = await selectGuestSession(tx, guestSessionId);

      if (!guestSession) {
        return {
          discarded: false,
          guestSessionId,
          mergedProgressCount: 0,
        };
      }

      const guestProgressRows = await selectGuestProgress(tx, guestSessionId);

      for (const guestProgress of guestProgressRows) {
        const userProgress = await selectUserProgress(
          tx,
          userId,
          guestProgress.challenge_id,
        );

        if (userProgress) {
          await updateUserProgressFromGuest(tx, {
            userId,
            challengeId: guestProgress.challenge_id,
            answeredCount:
              userProgress.answered_count + guestProgress.answered_count,
            correctCount: userProgress.correct_count + guestProgress.correct_count,
            needsReview:
              userProgress.needs_review || guestProgress.needs_review,
          });
        } else {
          await insertUserProgressFromGuest(tx, {
            userId,
            challengeId: guestProgress.challenge_id,
            needsReview: guestProgress.needs_review,
            answeredCount: guestProgress.answered_count,
            correctCount: guestProgress.correct_count,
          });
        }
      }

      await deleteGuestProgress(tx, guestSessionId);
      await deleteGuestSession(tx, guestSessionId);

      return {
        discarded: true,
        guestSessionId,
        mergedProgressCount: guestProgressRows.length,
      };
    });
  },
};
