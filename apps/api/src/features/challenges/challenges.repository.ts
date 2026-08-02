import { randomUUID } from "node:crypto";

import type {
  Challenge,
  ChallengeAnswerInput,
  ChallengeAnswerResponse,
  ChallengeDashboardResponse,
  ChallengeListQuery,
  ChallengeOptionWithAnswer,
  ChallengeProgress,
  ChallengeRestartResponse,
  ChallengeSessionMode,
  ChallengeSessionResponse,
  ChallengeWithAnswer,
  CreateChallengeInput,
  CreateChallengeOptionInput,
  UpdateChallengeInput,
} from "@repo/shared-types";
import type { SQL } from "@ydbjs/query";

import { getDb } from "../../lib/db.js";
import { toIsoDate, toNumber } from "../../lib/db-utils.js";
import type { ChallengePracticeActor } from "./challenges.service.js";
import {
  type ChallengeOptionRow,
  type ChallengeRow,
  deleteActorProgress,
  deleteChallengeById,
  deleteChallengeOptionsByChallengeId,
  deleteGuestProgressByChallengeId,
  deleteUserProgressByChallengeId,
  insertActorProgress,
  insertChallenge,
  insertChallengeOption,
  type ProgressRow,
  type PublicChallengeRow,
  selectActorAnsweredCount,
  selectActorProgress,
  selectActorProgressByTopic,
  selectActorProgressCount,
  selectChallengeById,
  selectChallengeBySlug,
  selectChallengeList,
  selectChallengeListTotal,
  selectChallengeTopicCounts,
  selectChallengeTotal,
  selectNextPracticeChallenge,
  selectNextReviewChallenge,
  selectOptionsByChallengeId,
  updateActorProgress,
  updateChallengeById,
} from "./challenges.sql.js";

const toChallengeProgress = (progress: ProgressRow): ChallengeProgress => {
  return {
    challengeId: progress.challenge_id,
    needsReview: progress.needs_review,
    answeredCount: toNumber(progress.answered_count),
    correctCount: toNumber(progress.correct_count),
  };
};

const toOptionWithAnswer = (
  option: ChallengeOptionRow,
): ChallengeOptionWithAnswer => {
  return {
    id: option.id,
    label: option.label,
    feedback: option.feedback,
    isCorrect: option.is_correct,
    order: toNumber(option.option_order),
  };
};

const toChallengeWithAnswer = (
  challenge: ChallengeRow,
  options: ChallengeOptionRow[],
): ChallengeWithAnswer => {
  return {
    id: challenge.id,
    snippetId: challenge.snippet_id,
    slug: challenge.slug,
    topicSlug: challenge.topic_slug,
    title: challenge.title,
    prompt: challenge.prompt,
    code: challenge.code,
    order: toNumber(challenge.challenge_order),
    createdAt: toIsoDate(challenge.created_at),
    updatedAt: toIsoDate(challenge.updated_at),
    options: options.map(toOptionWithAnswer),
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

const toPublicChallenge = (
  challenge: PublicChallengeRow,
  options: ChallengeOptionRow[],
): Challenge => {
  return {
    id: challenge.id,
    snippetId: challenge.snippet_id,
    slug: challenge.slug,
    topicSlug: challenge.topic_slug,
    title: challenge.title,
    prompt: challenge.prompt,
    code: combineRunnableCode(challenge.snippet_code, challenge.code),
    order: toNumber(challenge.challenge_order),
    createdAt: toIsoDate(challenge.created_at),
    updatedAt: toIsoDate(challenge.updated_at),
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      order: toNumber(option.option_order),
    })),
  };
};

const selectChallengeWithAnswerById = async (sql: SQL, id: string) => {
  const challenge = await selectChallengeById(sql, id);

  if (!challenge) {
    return null;
  }

  return toChallengeWithAnswer(
    challenge,
    await selectOptionsByChallengeId(sql, challenge.id),
  );
};

const insertOptions = async (
  sql: SQL,
  challengeId: string,
  options: CreateChallengeOptionInput[],
) => {
  for (const option of options) {
    await insertChallengeOption(sql, challengeId, randomUUID(), option);
  }
};

const upsertActorProgress = async (
  sql: SQL,
  actor: ChallengePracticeActor,
  challengeId: string,
  isCorrect: boolean,
) => {
  const current = await selectActorProgress(sql, actor, challengeId);

  if (current) {
    const nextProgress = {
      challenge_id: challengeId,
      needs_review: !isCorrect,
      answered_count: toNumber(current.answered_count) + 1,
      correct_count: toNumber(current.correct_count) + (isCorrect ? 1 : 0),
    };

    await updateActorProgress(sql, actor, nextProgress);

    return nextProgress;
  }

  const progress = {
    challenge_id: challengeId,
    needs_review: !isCorrect,
    answered_count: 1,
    correct_count: isCorrect ? 1 : 0,
  };

  await insertActorProgress(sql, actor, progress);

  return progress;
};

export const challengesRepository = {
  async answer(
    actor: ChallengePracticeActor,
    challengeId: string,
    input: ChallengeAnswerInput,
  ): Promise<ChallengeAnswerResponse["data"] | null> {
    const sql = await getDb();

    return sql.begin(async (tx) => {
      const challenge = await selectChallengeById(tx, challengeId);

      if (!challenge) {
        return null;
      }

      const options = await selectOptionsByChallengeId(tx, challengeId);
      const selectedOption = options.find((option) => option.id === input.optionId);
      const correctOption = options.find((option) => option.is_correct);

      if (!selectedOption || !correctOption) {
        return null;
      }

      const isCorrect = selectedOption.id === correctOption.id;
      const progress = await upsertActorProgress(tx, actor, challengeId, isCorrect);

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
    const sql = await getDb();
    const id = randomUUID();

    await sql.begin(async (tx) => {
      await insertChallenge(tx, id, input);

      await insertOptions(tx, id, input.options);
    });

    const challenge = await selectChallengeWithAnswerById(sql, id);

    if (!challenge) {
      throw new Error("Database challenge create did not return a challenge");
    }

    return challenge;
  },
  async dashboard(
    actor: ChallengePracticeActor,
  ): Promise<ChallengeDashboardResponse["data"]> {
    const sql = await getDb();
    const totalRow = await selectChallengeTotal(sql);
    const topicCounts = await selectChallengeTopicCounts(sql);
    const progress = await selectActorProgressByTopic(sql, actor);
    const totalChallenges = toNumber(totalRow?.total);
    const totalAnswerAttempts = progress.reduce(
      (total, item) => total + toNumber(item.answered_count),
      0,
    );
    const answeredChallengeCount = progress.filter(
      (item) => toNumber(item.answered_count) > 0,
    ).length;
    const reviewCount = progress.filter((item) => item.needs_review).length;
    const masteredChallengeCount = progress.filter(
      (item) => toNumber(item.answered_count) > 0 && !item.needs_review,
    ).length;
    const progressByTopic = new Map<
      string,
      { completed: number; mastered: number }
    >();

    for (const item of progress) {
      const current = progressByTopic.get(item.topic_slug) ?? {
        completed: 0,
        mastered: 0,
      };

      if (toNumber(item.answered_count) > 0) {
        current.completed += 1;
      }

      if (toNumber(item.answered_count) > 0 && !item.needs_review) {
        current.mastered += 1;
      }

      progressByTopic.set(item.topic_slug, current);
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
        const topicProgress = progressByTopic.get(topic.topic_slug) ?? {
          completed: 0,
          mastered: 0,
        };

        return {
          topicSlug: topic.topic_slug,
          total: toNumber(topic.total),
          completed: topicProgress.completed,
          mastered: topicProgress.mastered,
        };
      }),
    };
  },
  async delete(id: string) {
    const sql = await getDb();

    return sql.begin(async (tx) => {
      const challenge = await selectChallengeById(tx, id);

      if (!challenge) {
        return null;
      }

      await deleteUserProgressByChallengeId(tx, id);
      await deleteGuestProgressByChallengeId(tx, id);
      await deleteChallengeOptionsByChallengeId(tx, id);
      await deleteChallengeById(tx, id);

      return challenge.id;
    });
  },
  async findById(id: string) {
    const sql = await getDb();

    return selectChallengeWithAnswerById(sql, id);
  },
  async findBySlug(slug: string) {
    const sql = await getDb();

    return selectChallengeBySlug(sql, slug);
  },
  async list(query: ChallengeListQuery) {
    const sql = await getDb();
    const totalRow = await selectChallengeListTotal(sql, query);
    const challenges = await selectChallengeList(sql, query);
    const data: ChallengeWithAnswer[] = [];

    for (const challenge of challenges) {
      data.push(
        toChallengeWithAnswer(
          challenge,
          await selectOptionsByChallengeId(sql, challenge.id),
        ),
      );
    }

    const total = toNumber(totalRow?.total);

    return {
      data,
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
    const sql = await getDb();
    const totalRow = await selectChallengeTotal(sql);
    const progressSummaryRow = await selectActorAnsweredCount(sql, actor);
    const challenge =
      mode === "review"
        ? await selectNextReviewChallenge(sql, actor)
        : await selectNextPracticeChallenge(sql, actor);

    return {
      mode,
      answered: toNumber(progressSummaryRow?.total),
      total: toNumber(totalRow?.total),
      challenge: challenge
        ? toPublicChallenge(
            challenge,
            await selectOptionsByChallengeId(sql, challenge.id),
          )
        : null,
    };
  },
  async restart(
    actor: ChallengePracticeActor,
  ): Promise<ChallengeRestartResponse["data"]> {
    const sql = await getDb();
    const row = await selectActorProgressCount(sql, actor);

    await deleteActorProgress(sql, actor);

    return {
      resetCount: toNumber(row?.total),
    };
  },
  async update(id: string, input: UpdateChallengeInput) {
    const sql = await getDb();

    await sql.begin(async (tx) => {
      await updateChallengeById(tx, id, input);

      if (input.options) {
        await deleteChallengeOptionsByChallengeId(tx, id);
        await insertOptions(tx, id, input.options);
      }
    });

    const challenge = await selectChallengeWithAnswerById(sql, id);

    if (!challenge) {
      throw new Error("Database challenge update did not return a challenge");
    }

    return challenge;
  },
  toChallengeWithAnswer,
};
