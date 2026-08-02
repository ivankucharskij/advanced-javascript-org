import type { SQL } from "@ydbjs/query";

export type GuestSessionRow = {
  created_at: Date | string;
  id: string;
  updated_at: Date | string;
};

export type GuestSessionProgressSummaryRow = {
  needs_review_count: bigint | number | null;
  progress_count: bigint | number;
  total_answered: bigint | number | null;
};

export type GuestProgressRow = {
  answered_count: number;
  challenge_id: string;
  correct_count: number;
  needs_review: boolean;
};

export type UserProgressRow = {
  answered_count: number;
  correct_count: number;
  needs_review: boolean;
};

export const selectGuestSession = async (sql: SQL, id: string) => {
  const [rows] = await sql<[GuestSessionRow]>`
    SELECT id, created_at, updated_at
    FROM guest_sessions
    WHERE id = CAST(${id} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectGuestProgressSummary = async (
  sql: SQL,
  guestSessionId: string,
) => {
  const [rows] = await sql<[GuestSessionProgressSummaryRow]>`
    SELECT
      COUNT(*) AS progress_count,
      COALESCE(SUM(answered_count), 0) AS total_answered,
      COALESCE(SUM(CASE WHEN needs_review THEN 1 ELSE 0 END), 0) AS needs_review_count
    FROM guest_challenge_progress
    WHERE guest_session_id = CAST(${guestSessionId} AS Utf8)
  `;

  return rows[0];
};

export const selectGuestProgress = async (sql: SQL, guestSessionId: string) => {
  const [rows] = await sql<[GuestProgressRow]>`
    SELECT challenge_id, needs_review, answered_count, correct_count
    FROM guest_challenge_progress
    WHERE guest_session_id = CAST(${guestSessionId} AS Utf8)
  `;

  return rows;
};

export const selectUserProgress = async (
  sql: SQL,
  userId: string,
  challengeId: string,
) => {
  const [rows] = await sql<[UserProgressRow]>`
    SELECT needs_review, answered_count, correct_count
    FROM user_challenge_progress
    WHERE user_id = CAST(${userId} AS Utf8)
      AND challenge_id = CAST(${challengeId} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const insertGuestSession = (sql: SQL, id: string) => {
  return sql`
    UPSERT INTO guest_sessions (id, created_at, updated_at)
    VALUES (
      CAST(${id} AS Utf8),
      CurrentUtcTimestamp(),
      CurrentUtcTimestamp()
    )
  `;
};

export const deleteGuestProgress = (sql: SQL, guestSessionId: string) => {
  return sql`
    DELETE FROM guest_challenge_progress
    WHERE guest_session_id = CAST(${guestSessionId} AS Utf8)
  `;
};

export const deleteGuestSession = (sql: SQL, id: string) => {
  return sql`
    DELETE FROM guest_sessions
    WHERE id = CAST(${id} AS Utf8)
  `;
};

export const updateUserProgressFromGuest = (
  sql: SQL,
  input: {
    answeredCount: number;
    challengeId: string;
    correctCount: number;
    needsReview: boolean;
    userId: string;
  },
) => {
  return sql`
    UPDATE user_challenge_progress
    SET
      answered_count = CAST(${input.answeredCount} AS Int32),
      correct_count = CAST(${input.correctCount} AS Int32),
      needs_review = CAST(${input.needsReview} AS Bool),
      updated_at = CurrentUtcTimestamp()
    WHERE user_id = CAST(${input.userId} AS Utf8)
      AND challenge_id = CAST(${input.challengeId} AS Utf8)
  `;
};

export const insertUserProgressFromGuest = (
  sql: SQL,
  input: {
    answeredCount: number;
    challengeId: string;
    correctCount: number;
    needsReview: boolean;
    userId: string;
  },
) => {
  return sql`
    UPSERT INTO user_challenge_progress (
      user_id,
      challenge_id,
      needs_review,
      answered_count,
      correct_count,
      updated_at
    )
    VALUES (
      CAST(${input.userId} AS Utf8),
      CAST(${input.challengeId} AS Utf8),
      CAST(${input.needsReview} AS Bool),
      CAST(${input.answeredCount} AS Int32),
      CAST(${input.correctCount} AS Int32),
      CurrentUtcTimestamp()
    )
  `;
};
