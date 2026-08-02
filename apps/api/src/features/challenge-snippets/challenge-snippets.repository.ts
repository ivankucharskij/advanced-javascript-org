import { randomUUID } from "node:crypto";

import type {
  ChallengeSnippet,
  ChallengeSnippetListQuery,
  CreateChallengeSnippetInput,
  UpdateChallengeSnippetInput,
} from "@repo/shared-types";

import { getDb } from "../../lib/db.js";
import { toIsoDate, toNumber } from "../../lib/db-utils.js";
import {
  type ChallengeSnippetRow,
  deleteChallengeSnippetById,
  insertChallengeSnippet,
  selectChallengeSnippetById,
  selectChallengeSnippetBySlug,
  selectChallengeSnippetList,
  selectChallengeSnippetListTotal,
  selectChallengeUsingSnippet,
  updateChallengeSnippetById,
} from "./challenge-snippets.sql.js";

const toChallengeSnippet = (snippet: ChallengeSnippetRow): ChallengeSnippet => {
  return {
    id: snippet.id,
    slug: snippet.slug,
    topicSlug: snippet.topic_slug,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    createdAt: toIsoDate(snippet.created_at),
    updatedAt: toIsoDate(snippet.updated_at),
  };
};

export const challengeSnippetsRepository = {
  async create(input: CreateChallengeSnippetInput) {
    const sql = await getDb();
    const id = randomUUID();

    await insertChallengeSnippet(sql, id, input);

    const snippet = await selectChallengeSnippetById(sql, id);

    if (!snippet) {
      throw new Error(
        "Database challenge snippet create did not return a snippet",
      );
    }

    return toChallengeSnippet(snippet);
  },
  async delete(id: string) {
    const sql = await getDb();

    return sql.begin(async (tx) => {
      const snippet = await selectChallengeSnippetById(tx, id);

      if (!snippet) {
        return {
          id: null,
          isUsed: false,
        };
      }

      const usedChallenge = await selectChallengeUsingSnippet(tx, id);

      if (usedChallenge) {
        return {
          id: snippet.id,
          isUsed: true,
        };
      }

      await deleteChallengeSnippetById(tx, id);

      return {
        id: snippet.id,
        isUsed: false,
      };
    });
  },
  async findById(id: string) {
    const sql = await getDb();

    return selectChallengeSnippetById(sql, id);
  },
  async findBySlug(slug: string) {
    const sql = await getDb();

    return selectChallengeSnippetBySlug(sql, slug);
  },
  async list(query: ChallengeSnippetListQuery) {
    const sql = await getDb();
    const totalRow = await selectChallengeSnippetListTotal(sql, query);
    const snippets = await selectChallengeSnippetList(sql, query);
    const total = toNumber(totalRow?.total);

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
    const sql = await getDb();

    await updateChallengeSnippetById(sql, id, input);

    const snippet = await selectChallengeSnippetById(sql, id);

    if (!snippet) {
      throw new Error(
        "Database challenge snippet update did not return a snippet",
      );
    }

    return toChallengeSnippet(snippet);
  },
  toChallengeSnippet,
};
