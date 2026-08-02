import type { SQL } from "@ydbjs/query";

import { optionalUtf8 } from "../../lib/db-utils.js";

export type UpsertGoogleUserInput = {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  providerAccountId: string;
};

export type UserRow = {
  avatar_url: string | null;
  created_at: Date | string;
  email: string;
  full_name: string;
  id: string;
  updated_at: Date | string;
};

export type OAuthAccountRow = {
  id: string;
  user_id: string;
};

export const selectUserById = async (sql: SQL, id: string) => {
  const [rows] = await sql<[UserRow]>`
    SELECT id, full_name, email, avatar_url, created_at, updated_at
    FROM users
    WHERE id = CAST(${id} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectUserByEmail = async (sql: SQL, email: string) => {
  const [rows] = await sql<[UserRow]>`
    SELECT id, full_name, email, avatar_url, created_at, updated_at
    FROM users VIEW users_email_unique
    WHERE email = CAST(${email} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectOAuthAccountByProvider = async (
  sql: SQL,
  providerAccountId: string,
) => {
  const [rows] = await sql<[OAuthAccountRow]>`
    SELECT id, user_id
    FROM oauth_accounts VIEW oauth_accounts_provider_account_unique
    WHERE provider = "google"
      AND provider_account_id = CAST(${providerAccountId} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const updateGoogleUser = (
  sql: SQL,
  id: string,
  input: UpsertGoogleUserInput,
) => {
  return sql`
    UPDATE users
    SET
      full_name = CAST(${input.fullName} AS Utf8),
      email = CAST(${input.email} AS Utf8),
      avatar_url = ${optionalUtf8(input.avatarUrl)},
      updated_at = CurrentUtcTimestamp()
    WHERE id = CAST(${id} AS Utf8)
  `;
};

export const insertGoogleUser = (
  sql: SQL,
  id: string,
  input: UpsertGoogleUserInput,
) => {
  return sql`
    UPSERT INTO users (
      id,
      full_name,
      email,
      avatar_url,
      created_at,
      updated_at
    )
    VALUES (
      CAST(${id} AS Utf8),
      CAST(${input.fullName} AS Utf8),
      CAST(${input.email} AS Utf8),
      ${optionalUtf8(input.avatarUrl)},
      CurrentUtcTimestamp(),
      CurrentUtcTimestamp()
    )
  `;
};

export const updateGoogleOAuthAccount = (
  sql: SQL,
  id: string,
  userId: string,
  email: string,
) => {
  return sql`
    UPDATE oauth_accounts
    SET
      user_id = CAST(${userId} AS Utf8),
      email = CAST(${email} AS Utf8),
      updated_at = CurrentUtcTimestamp()
    WHERE id = CAST(${id} AS Utf8)
  `;
};

export const insertGoogleOAuthAccount = (
  sql: SQL,
  input: {
    email: string;
    id: string;
    providerAccountId: string;
    userId: string;
  },
) => {
  return sql`
    UPSERT INTO oauth_accounts (
      id,
      provider,
      provider_account_id,
      user_id,
      email,
      created_at,
      updated_at
    )
    VALUES (
      CAST(${input.id} AS Utf8),
      "google",
      CAST(${input.providerAccountId} AS Utf8),
      CAST(${input.userId} AS Utf8),
      CAST(${input.email} AS Utf8),
      CurrentUtcTimestamp(),
      CurrentUtcTimestamp()
    )
  `;
};
