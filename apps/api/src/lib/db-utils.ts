import { fragment } from "@ydbjs/query";

type DbDateValue = Date | number | string | { toISOString(): string };

export const optionalUtf8 = (value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return fragment`CAST(NULL AS Utf8?)`;
  }

  return fragment`CAST(${value} AS Utf8?)`;
};

export const toIsoDate = (value: DbDateValue): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    return value.toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Database timestamp could not be converted to an ISO string");
  }

  return date.toISOString();
};

export const toNumber = (value: bigint | number | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
};
