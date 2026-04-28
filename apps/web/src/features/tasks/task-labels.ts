import type {
  GetTasks200DataItemPriority,
  GetTasks200DataItemStatus,
} from "@repo/api-client";

export const priorityLabel: Record<GetTasks200DataItemPriority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
};

export const statusLabel: Record<GetTasks200DataItemStatus, string> = {
  TODO: "Ожидает",
  IN_PROGRESS: "В работе",
  DONE: "Готово",
};
