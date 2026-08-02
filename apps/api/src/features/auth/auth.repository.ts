import { randomUUID } from "node:crypto";

import type { User } from "@repo/shared-types";

import { getDb } from "../../lib/db.js";
import { toIsoDate } from "../../lib/db-utils.js";
import {
  insertGoogleOAuthAccount,
  insertGoogleUser,
  selectOAuthAccountByProvider,
  selectUserByEmail,
  selectUserById,
  updateGoogleOAuthAccount,
  updateGoogleUser,
  type UpsertGoogleUserInput,
  type UserRow,
} from "./auth.sql.js";

const toUser = (row: UserRow): User => {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at),
  };
};

export const authRepository = {
  async findUserById(id: string) {
    const sql = await getDb();
    const user = await selectUserById(sql, id);

    return user ? toUser(user) : null;
  },
  async upsertGoogleUser(input: UpsertGoogleUserInput) {
    const sql = await getDb();

    return sql.begin(async (tx) => {
      const userByEmail = await selectUserByEmail(tx, input.email);
      const googleAccount = await selectOAuthAccountByProvider(
        tx,
        input.providerAccountId,
      );

      if (
        userByEmail &&
        googleAccount &&
        googleAccount.user_id !== userByEmail.id
      ) {
        throw new Error("Google account is linked to a different user");
      }

      const userId = userByEmail?.id ?? googleAccount?.user_id ?? randomUUID();
      const linkedUser = userByEmail ?? (await selectUserById(tx, userId));

      if (linkedUser) {
        await updateGoogleUser(tx, linkedUser.id, input);
      } else {
        await insertGoogleUser(tx, userId, input);
      }

      if (googleAccount) {
        await updateGoogleOAuthAccount(tx, googleAccount.id, userId, input.email);
      } else {
        await insertGoogleOAuthAccount(tx, {
          id: randomUUID(),
          providerAccountId: input.providerAccountId,
          userId,
          email: input.email,
        });
      }

      const user = await selectUserById(tx, userId);

      if (!user) {
        throw new Error("Database user upsert did not return a user");
      }

      return toUser(user);
    });
  },
};
