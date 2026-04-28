import {
  type GetTasks200DataItemPriority,
  type GetTasks200DataItemStatus,
  GetTasksPriority,
  GetTasksStatus,
} from "@repo/api-client";
import { addYears, startOfDay } from "date-fns";
import z from "zod";

const priorityValues = Object.values(GetTasksPriority) as [
  GetTasks200DataItemPriority,
  ...GetTasks200DataItemPriority[],
];
const statusValues = Object.values(GetTasksStatus) as [
  GetTasks200DataItemStatus,
  ...GetTasks200DataItemStatus[],
];

export const AddTaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Название слишком короткое")
    .max(100, "Название слишком длинное"),
  description: z.string().optional(),
  priority: z.enum(priorityValues),
  status: z.enum(statusValues),
  dueDate: z
    .date()
    .nullable()
    .refine(
      (date) => !date || date >= startOfDay(new Date()),
      "Дата не может быть раньше сегодняшнего дня",
    )
    .refine(
      (date) => !date || date <= addYears(new Date(), 1),
      "Дата не может быть больше чем через год",
    ),
});

export type AddTaskFormType = typeof AddTaskFormSchema;
export type AddTaskFormFields = z.infer<typeof AddTaskFormSchema>;

export const EditTaskFormSchema = z.object({
  title: z.string().trim().max(100, "Название слишком длинное").optional(),
  description: z.string().optional(),
  priority: z.enum(priorityValues).optional().or(z.literal("")),
  status: z.enum(statusValues).optional().or(z.literal("")),
  dueDate: z
    .date()
    .nullable()
    .refine(
      (date) => !date || date >= startOfDay(new Date()),
      "Дата не может быть раньше сегодняшнего дня",
    )
    .refine(
      (date) => !date || date <= addYears(new Date(), 1),
      "Дата не может быть больше чем через год",
    )
    .optional(),
});

export type EditTaskFormType = typeof EditTaskFormSchema;
export type EditTaskFormFields = z.infer<typeof EditTaskFormSchema>;
