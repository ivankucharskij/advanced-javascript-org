import type { SQL } from "@ydbjs/query";

export const selectDbHealth = async (sql: SQL) => {
  const [rows] = await sql<[{ one: number }]>`SELECT 1 AS one`;

  return rows[0] ?? null;
};
