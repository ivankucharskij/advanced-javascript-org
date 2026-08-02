import type {
  ChallengeSnippetListQuery,
  CreateChallengeSnippetInput,
  UpdateChallengeSnippetInput,
} from "@repo/shared-types";
import { type Fragment, fragment, join, type SQL, unsafe } from "@ydbjs/query";

export type ChallengeSnippetRow = {
  code: string;
  created_at: Date | string;
  id: string;
  language: string;
  slug: string;
  title: string;
  topic_slug: string;
  updated_at: Date | string;
};

export type CountRow = {
  total: bigint | number;
};

const sortExpressionByField: Record<
  ChallengeSnippetListQuery["sortBy"],
  string
> = {
  createdAt: "created_at",
  slug: "Unicode::ToLower(slug)",
  title: "Unicode::ToLower(title)",
  topicSlug: "Unicode::ToLower(topic_slug)",
  updatedAt: "updated_at",
};

const whereForList = (query: ChallengeSnippetListQuery) => {
  const filters: Fragment[] = [];

  if (query.slug) {
    filters.push(fragment`slug ILIKE CAST(${"%" + query.slug + "%"} AS Utf8)`);
  }

  if (query.topicSlug) {
    filters.push(fragment`topic_slug = CAST(${query.topicSlug} AS Utf8)`);
  }

  if (query.q) {
    const q = `%${query.q}%`;

    filters.push(
      fragment`(
        title ILIKE CAST(${q} AS Utf8)
        OR code ILIKE CAST(${q} AS Utf8)
      )`,
    );
  }

  if (filters.length === 0) {
    return fragment``;
  }

  return fragment`WHERE ${join(filters, " AND ")}`;
};

const orderByForList = (query: ChallengeSnippetListQuery) => {
  const sortExpression = sortExpressionByField[query.sortBy];
  const direction = query.sortDirection === "desc" ? "DESC" : "ASC";
  const primary = fragment`${unsafe(sortExpression)} ${unsafe(direction)}`;
  const orderBy = [primary];

  if (query.sortBy !== "topicSlug") {
    orderBy.push(fragment`Unicode::ToLower(topic_slug) ASC`);
  }

  orderBy.push(fragment`created_at ASC`);
  orderBy.push(fragment`id ASC`);

  return fragment`ORDER BY ${join(orderBy, ", ")}`;
};

const updateSets = (input: UpdateChallengeSnippetInput) => {
  const sets: Fragment[] = [];

  if (input.slug !== undefined) {
    sets.push(fragment`slug = CAST(${input.slug} AS Utf8)`);
  }

  if (input.topicSlug !== undefined) {
    sets.push(fragment`topic_slug = CAST(${input.topicSlug} AS Utf8)`);
  }

  if (input.title !== undefined) {
    sets.push(fragment`title = CAST(${input.title} AS Utf8)`);
  }

  if (input.language !== undefined) {
    sets.push(fragment`language = CAST(${input.language} AS Utf8)`);
  }

  if (input.code !== undefined) {
    sets.push(fragment`code = CAST(${input.code} AS Utf8)`);
  }

  sets.push(fragment`updated_at = CurrentUtcTimestamp()`);

  return join(sets, ", ");
};

export const insertChallengeSnippet = (
  sql: SQL,
  id: string,
  input: CreateChallengeSnippetInput,
) => {
  return sql`
    UPSERT INTO challenge_snippets (
      id,
      slug,
      topic_slug,
      title,
      language,
      code,
      created_at,
      updated_at
    )
    VALUES (
      CAST(${id} AS Utf8),
      CAST(${input.slug} AS Utf8),
      CAST(${input.topicSlug} AS Utf8),
      CAST(${input.title} AS Utf8),
      CAST(${input.language} AS Utf8),
      CAST(${input.code} AS Utf8),
      CurrentUtcTimestamp(),
      CurrentUtcTimestamp()
    )
  `;
};

export const selectChallengeSnippetById = async (sql: SQL, id: string) => {
  const [rows] = await sql<[ChallengeSnippetRow]>`
    SELECT id, slug, topic_slug, title, language, code, created_at, updated_at
    FROM challenge_snippets
    WHERE id = CAST(${id} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectChallengeSnippetBySlug = async (sql: SQL, slug: string) => {
  const [rows] = await sql<[{ id: string }]>`
    SELECT id
    FROM challenge_snippets VIEW challenge_snippets_slug_unique
    WHERE slug = CAST(${slug} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const selectChallengeUsingSnippet = async (sql: SQL, snippetId: string) => {
  const [rows] = await sql<[{ id: string }]>`
    SELECT id
    FROM challenges VIEW challenges_by_snippet
    WHERE snippet_id = CAST(${snippetId} AS Utf8)
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const deleteChallengeSnippetById = (sql: SQL, id: string) => {
  return sql`
    DELETE FROM challenge_snippets
    WHERE id = CAST(${id} AS Utf8)
  `;
};

export const selectChallengeSnippetListTotal = async (
  sql: SQL,
  query: ChallengeSnippetListQuery,
) => {
  const where = whereForList(query);
  const [rows] = await sql<[CountRow]>`
    SELECT COUNT(*) AS total
    FROM challenge_snippets
    ${where}
  `;

  return rows[0];
};

export const selectChallengeSnippetList = async (
  sql: SQL,
  query: ChallengeSnippetListQuery,
) => {
  const where = whereForList(query);
  const orderBy = orderByForList(query);
  const offset = (query.page - 1) * query.limit;
  const [rows] = await sql<[ChallengeSnippetRow]>`
    SELECT id, slug, topic_slug, title, language, code, created_at, updated_at
    FROM challenge_snippets
    ${where}
    ${orderBy}
    LIMIT CAST(${query.limit} AS Int32)
    OFFSET CAST(${offset} AS Int32)
  `;

  return rows;
};

export const updateChallengeSnippetById = (
  sql: SQL,
  id: string,
  input: UpdateChallengeSnippetInput,
) => {
  return sql`
    UPDATE challenge_snippets
    SET ${updateSets(input)}
    WHERE id = CAST(${id} AS Utf8)
  `;
};
