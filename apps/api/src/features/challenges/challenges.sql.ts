import type {
  ChallengeListQuery,
  CreateChallengeInput,
  CreateChallengeOptionInput,
  UpdateChallengeInput,
} from "@repo/shared-types";
import { type Fragment, fragment, join, type SQL, unsafe } from "@ydbjs/query";

import { optionalUtf8 } from "../../lib/db-utils.js";
import type { ChallengePracticeActor } from "./challenges.service.js";

export type ChallengeRow = {
  challenge_order: number;
  code: string | null;
  created_at: Date | string;
  id: string;
  prompt: string;
  slug: string;
  snippet_id: string;
  title: string;
  topic_slug: string;
  updated_at: Date | string;
};

export type PublicChallengeRow = ChallengeRow & {
  snippet_code: string;
};

export type ChallengeOptionRow = {
  feedback: string;
  id: string;
  is_correct: boolean;
  label: string;
  option_order: number;
};

export type CountRow = {
  total: bigint | number | null;
};

export type TopicCountRow = {
  topic_slug: string;
  total: bigint | number;
};

export type ProgressTopicRow = {
  answered_count: number;
  correct_count: number;
  needs_review: boolean;
  topic_slug: string;
};

export type ProgressRow = {
  answered_count: number;
  challenge_id: string;
  correct_count: number;
  needs_review: boolean;
};

const sortExpressionByField: Record<ChallengeListQuery["sortBy"], string> = {
  createdAt: "c.created_at",
  order: "c.challenge_order",
  slug: "Unicode::ToLower(c.slug)",
  title: "Unicode::ToLower(c.title)",
  topicSlug: "Unicode::ToLower(c.topic_slug)",
  updatedAt: "c.updated_at",
};

const whereForList = (query: ChallengeListQuery) => {
  const filters: Fragment[] = [];

  if (query.slug) {
    filters.push(fragment`c.slug ILIKE CAST(${"%" + query.slug + "%"} AS Utf8)`);
  }

  if (query.topicSlug) {
    filters.push(fragment`c.topic_slug = CAST(${query.topicSlug} AS Utf8)`);
  }

  if (query.snippetId) {
    filters.push(fragment`c.snippet_id = CAST(${query.snippetId} AS Utf8)`);
  }

  if (query.q) {
    const q = `%${query.q}%`;

    filters.push(
      fragment`(
        c.title ILIKE CAST(${q} AS Utf8)
        OR c.prompt ILIKE CAST(${q} AS Utf8)
        OR s.code ILIKE CAST(${q} AS Utf8)
      )`,
    );
  }

  if (filters.length === 0) {
    return fragment``;
  }

  return fragment`WHERE ${join(filters, " AND ")}`;
};

const orderByForList = (query: ChallengeListQuery) => {
  const sortExpression = sortExpressionByField[query.sortBy];
  const direction = query.sortDirection === "desc" ? "DESC" : "ASC";
  const orderBy = [fragment`${unsafe(sortExpression)} ${unsafe(direction)}`];

  if (query.sortBy !== "topicSlug") {
    orderBy.push(fragment`Unicode::ToLower(c.topic_slug) ASC`);
  }

  if (query.sortBy !== "order") {
    orderBy.push(fragment`c.challenge_order ASC`);
  }

  orderBy.push(fragment`c.created_at ASC`);
  orderBy.push(fragment`c.id ASC`);

  return fragment`ORDER BY ${join(orderBy, ", ")}`;
};

const updateSets = (input: UpdateChallengeInput) => {
  const sets: Fragment[] = [];

  if (input.slug !== undefined) {
    sets.push(fragment`slug = CAST(${input.slug} AS Utf8)`);
  }

  if (input.snippetId !== undefined) {
    sets.push(fragment`snippet_id = CAST(${input.snippetId} AS Utf8)`);
  }

  if (input.topicSlug !== undefined) {
    sets.push(fragment`topic_slug = CAST(${input.topicSlug} AS Utf8)`);
  }

  if (input.title !== undefined) {
    sets.push(fragment`title = CAST(${input.title} AS Utf8)`);
  }

  if (input.prompt !== undefined) {
    sets.push(fragment`prompt = CAST(${input.prompt} AS Utf8)`);
  }

  if (input.code !== undefined) {
    sets.push(fragment`code = ${optionalUtf8(input.code)}`);
  }

  if (input.order !== undefined) {
    sets.push(fragment`challenge_order = CAST(${input.order} AS Int32)`);
  }

  sets.push(fragment`updated_at = CurrentUtcTimestamp()`);

  return join(sets, ", ");
};

const actorProgressTable = (actor: ChallengePracticeActor) => {
  return actor.userId
    ? "user_challenge_progress"
    : "guest_challenge_progress";
};

const actorIdColumn = (actor: ChallengePracticeActor) => {
  return actor.userId ? "user_id" : "guest_session_id";
};

const actorId = (actor: ChallengePracticeActor) => {
  return actor.userId ?? actor.guestSessionId ?? "";
};

export const selectChallengeById = async (sql: SQL, id: string) => {
  const [rows] = await sql<[ChallengeRow]>`
    SELECT
      id,
      snippet_id,
      slug,
      topic_slug,
      title,
      prompt,
      code,
      challenge_order,
      created_at,
      updated_at
    FROM challenges
    WHERE id = CAST(${id} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectOptionsByChallengeId = async (
  sql: SQL,
  challengeId: string,
) => {
  const [rows] = await sql<[ChallengeOptionRow]>`
    SELECT id, label, feedback, is_correct, option_order
    FROM challenge_options VIEW challenge_options_by_challenge
    WHERE challenge_id = CAST(${challengeId} AS Utf8)
    ORDER BY option_order ASC, id ASC
  `;

  return rows;
};

export const insertChallengeOption = (
  sql: SQL,
  challengeId: string,
  optionId: string,
  option: CreateChallengeOptionInput,
) => {
  return sql`
    UPSERT INTO challenge_options (
      id,
      challenge_id,
      option_order,
      label,
      is_correct,
      feedback
    )
    VALUES (
      CAST(${optionId} AS Utf8),
      CAST(${challengeId} AS Utf8),
      CAST(${option.order} AS Int32),
      CAST(${option.label} AS Utf8),
      CAST(${option.isCorrect} AS Bool),
      CAST(${option.feedback} AS Utf8)
    )
  `;
};

export const selectActorProgress = async (
  sql: SQL,
  actor: ChallengePracticeActor,
  challengeId: string,
) => {
  const [rows] = await sql<[ProgressRow]>`
    SELECT challenge_id, needs_review, answered_count, correct_count
    FROM ${unsafe(actorProgressTable(actor))}
    WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
      AND challenge_id = CAST(${challengeId} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const updateActorProgress = (
  sql: SQL,
  actor: ChallengePracticeActor,
  progress: ProgressRow,
) => {
  return sql`
    UPDATE ${unsafe(actorProgressTable(actor))}
    SET
      needs_review = CAST(${progress.needs_review} AS Bool),
      answered_count = CAST(${progress.answered_count} AS Int32),
      correct_count = CAST(${progress.correct_count} AS Int32),
      updated_at = CurrentUtcTimestamp()
    WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
      AND challenge_id = CAST(${progress.challenge_id} AS Utf8)
  `;
};

export const insertActorProgress = (
  sql: SQL,
  actor: ChallengePracticeActor,
  progress: ProgressRow,
) => {
  return sql`
    UPSERT INTO ${unsafe(actorProgressTable(actor))} (
      ${unsafe(actorIdColumn(actor))},
      challenge_id,
      needs_review,
      answered_count,
      correct_count,
      updated_at
    )
    VALUES (
      CAST(${actorId(actor)} AS Utf8),
      CAST(${progress.challenge_id} AS Utf8),
      CAST(${progress.needs_review} AS Bool),
      CAST(${progress.answered_count} AS Int32),
      CAST(${progress.correct_count} AS Int32),
      CurrentUtcTimestamp()
    )
  `;
};

export const insertChallenge = (
  sql: SQL,
  id: string,
  input: CreateChallengeInput,
) => {
  return sql`
    UPSERT INTO challenges (
      id,
      snippet_id,
      slug,
      topic_slug,
      title,
      prompt,
      code,
      challenge_order,
      created_at,
      updated_at
    )
    VALUES (
      CAST(${id} AS Utf8),
      CAST(${input.snippetId} AS Utf8),
      CAST(${input.slug} AS Utf8),
      CAST(${input.topicSlug} AS Utf8),
      CAST(${input.title} AS Utf8),
      CAST(${input.prompt} AS Utf8),
      ${optionalUtf8(input.code ?? null)},
      CAST(${input.order} AS Int32),
      CurrentUtcTimestamp(),
      CurrentUtcTimestamp()
    )
  `;
};

export const selectChallengeTotal = async (sql: SQL) => {
  const [rows] = await sql<[CountRow]>`
    SELECT COUNT(*) AS total
    FROM challenges
  `;

  return rows[0];
};

export const selectChallengeTopicCounts = async (sql: SQL) => {
  const [rows] = await sql<[TopicCountRow]>`
    SELECT topic_slug, COUNT(*) AS total
    FROM challenges
    GROUP BY topic_slug
    ORDER BY Unicode::ToLower(topic_slug) ASC
  `;

  return rows;
};

export const selectActorProgressByTopic = async (
  sql: SQL,
  actor: ChallengePracticeActor,
) => {
  const [rows] = await sql<[ProgressTopicRow]>`
    SELECT
      p.needs_review AS needs_review,
      p.answered_count AS answered_count,
      p.correct_count AS correct_count,
      c.topic_slug AS topic_slug
    FROM ${unsafe(actorProgressTable(actor))} AS p
    INNER JOIN challenges AS c
    ON p.challenge_id = c.id
    WHERE p.${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
  `;

  return rows;
};

export const deleteUserProgressByChallengeId = (sql: SQL, challengeId: string) => {
  return sql`
    DELETE FROM user_challenge_progress
    WHERE challenge_id = CAST(${challengeId} AS Utf8)
  `;
};

export const deleteGuestProgressByChallengeId = (
  sql: SQL,
  challengeId: string,
) => {
  return sql`
    DELETE FROM guest_challenge_progress
    WHERE challenge_id = CAST(${challengeId} AS Utf8)
  `;
};

export const deleteChallengeOptionsByChallengeId = (
  sql: SQL,
  challengeId: string,
) => {
  return sql`
    DELETE FROM challenge_options
    WHERE challenge_id = CAST(${challengeId} AS Utf8)
  `;
};

export const deleteChallengeById = (sql: SQL, id: string) => {
  return sql`
    DELETE FROM challenges
    WHERE id = CAST(${id} AS Utf8)
  `;
};

export const selectChallengeBySlug = async (sql: SQL, slug: string) => {
  const [rows] = await sql<[{ id: string }]>`
    SELECT id
    FROM challenges VIEW challenges_slug_unique
    WHERE slug = CAST(${slug} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectChallengeListTotal = async (
  sql: SQL,
  query: ChallengeListQuery,
) => {
  const where = whereForList(query);
  const [rows] = await sql<[CountRow]>`
    SELECT COUNT(*) AS total
    FROM challenges AS c
    INNER JOIN challenge_snippets AS s
    ON c.snippet_id = s.id
    ${where}
  `;

  return rows[0];
};

export const selectChallengeList = async (
  sql: SQL,
  query: ChallengeListQuery,
) => {
  const where = whereForList(query);
  const orderBy = orderByForList(query);
  const offset = (query.page - 1) * query.limit;
  const [rows] = await sql<[ChallengeRow]>`
    SELECT
      c.id AS id,
      c.snippet_id AS snippet_id,
      c.slug AS slug,
      c.topic_slug AS topic_slug,
      c.title AS title,
      c.prompt AS prompt,
      c.code AS code,
      c.challenge_order AS challenge_order,
      c.created_at AS created_at,
      c.updated_at AS updated_at
    FROM challenges AS c
    INNER JOIN challenge_snippets AS s
    ON c.snippet_id = s.id
    ${where}
    ${orderBy}
    LIMIT CAST(${query.limit} AS Int32)
    OFFSET CAST(${offset} AS Int32)
  `;

  return rows;
};

export const selectActorAnsweredCount = async (
  sql: SQL,
  actor: ChallengePracticeActor,
) => {
  const [rows] = await sql<[CountRow]>`
    SELECT COALESCE(SUM(answered_count), 0) AS total
    FROM ${unsafe(actorProgressTable(actor))}
    WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
  `;

  return rows[0];
};

export const selectNextReviewChallenge = async (
  sql: SQL,
  actor: ChallengePracticeActor,
) => {
  const [rows] = await sql<[PublicChallengeRow]>`
    SELECT
      c.id AS id,
      c.snippet_id AS snippet_id,
      c.slug AS slug,
      c.topic_slug AS topic_slug,
      c.title AS title,
      c.prompt AS prompt,
      c.code AS code,
      c.challenge_order AS challenge_order,
      c.created_at AS created_at,
      c.updated_at AS updated_at,
      s.code AS snippet_code
    FROM ${unsafe(actorProgressTable(actor))} AS p
    INNER JOIN challenges AS c
    ON p.challenge_id = c.id
    INNER JOIN challenge_snippets AS s
    ON c.snippet_id = s.id
    WHERE p.${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
      AND p.needs_review = true
    ORDER BY Unicode::ToLower(c.topic_slug) ASC, c.challenge_order ASC, c.created_at ASC, c.id ASC
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectNextPracticeChallenge = async (
  sql: SQL,
  actor: ChallengePracticeActor,
) => {
  const [rows] = await sql<[PublicChallengeRow]>`
    SELECT
      c.id AS id,
      c.snippet_id AS snippet_id,
      c.slug AS slug,
      c.topic_slug AS topic_slug,
      c.title AS title,
      c.prompt AS prompt,
      c.code AS code,
      c.challenge_order AS challenge_order,
      c.created_at AS created_at,
      c.updated_at AS updated_at,
      s.code AS snippet_code
    FROM challenges AS c
    INNER JOIN challenge_snippets AS s
    ON c.snippet_id = s.id
    LEFT JOIN (
      SELECT challenge_id, answered_count
      FROM ${unsafe(actorProgressTable(actor))}
      WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
    ) AS p
    ON p.challenge_id = c.id
    WHERE p.challenge_id IS NULL
      OR p.answered_count <= 0
    ORDER BY Unicode::ToLower(c.topic_slug) ASC, c.challenge_order ASC, c.created_at ASC, c.id ASC
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectActorProgressCount = async (
  sql: SQL,
  actor: ChallengePracticeActor,
) => {
  const [rows] = await sql<[CountRow]>`
    SELECT COUNT(*) AS total
    FROM ${unsafe(actorProgressTable(actor))}
    WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
  `;

  return rows[0];
};

export const deleteActorProgress = (sql: SQL, actor: ChallengePracticeActor) => {
  return sql`
    DELETE FROM ${unsafe(actorProgressTable(actor))}
    WHERE ${unsafe(actorIdColumn(actor))} = CAST(${actorId(actor)} AS Utf8)
  `;
};

export const updateChallengeById = (
  sql: SQL,
  id: string,
  input: UpdateChallengeInput,
) => {
  return sql`
    UPDATE challenges
    SET ${updateSets(input)}
    WHERE id = CAST(${id} AS Utf8)
  `;
};
