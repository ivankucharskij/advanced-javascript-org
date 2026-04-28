import type { GetTasksOrder, GetTasksSortBy } from "@repo/api-client";

export interface TaskHeadCell {
  id: GetTasksSortBy;
  label: string;
}

export type Order = GetTasksOrder;

export type CommonError = { name: string; message: string; details?: string };
