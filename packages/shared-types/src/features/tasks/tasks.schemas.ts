import { z } from "@hono/zod-openapi";

import {
  errorResponseSchema as sharedErrorResponseSchema,
  paginationMetaSchema,
} from "../../shared/schemas.js";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  parentId: string | null;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  tags?: string[];
  parentId?: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  tags?: string[];
  parentId?: string | null;
};

export type DeleteManyTasksInput = {
  ids: string[];
};

export type TaskQuery = {
  page: number;
  limit: number;
  sortBy?:
    | "id"
    | "title"
    | "description"
    | "priority"
    | "status"
    | "dueDate"
    | "createdAt"
    | "updatedAt"
    | "parentId";
  order?: "asc" | "desc";
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDateStart?: string;
  dueDateEnd?: string;
  q?: string;
};

export type TaskIdParams = {
  id: string;
};

export type TaskListResponse = {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type SingleTaskResponse = {
  data: Task;
};

export type DeleteManyTasksResponse = {
  count: number;
};

export const taskPrioritySchema: z.ZodType<TaskPriority> = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const taskStatusSchema: z.ZodType<TaskStatus> = z.enum([
  "TODO",
  "IN_PROGRESS",
  "DONE",
]);

export const taskSchema: z.ZodType<Task> = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  description: z.string().nullable(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  dueDate: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  tags: z.array(z.string()),
  parentId: z.uuid().nullable(),
});

export const createTaskSchema: z.ZodType<CreateTaskInput> = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  dueDate: z.iso.datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.uuid().nullable().optional(),
});

export const updateTaskSchema: z.ZodType<UpdateTaskInput> = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  dueDate: z.iso.datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.uuid().nullable().optional(),
});

export const deleteManyTasksSchema: z.ZodType<DeleteManyTasksInput> = z.object({
  ids: z.array(z.uuid()).min(1),
});

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
  sortBy: z
    .enum([
      "id",
      "title",
      "description",
      "priority",
      "status",
      "dueDate",
      "createdAt",
      "updatedAt",
      "parentId",
    ])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  dueDateStart: z.iso.datetime().optional(),
  dueDateEnd: z.iso.datetime().optional(),
  q: z.string().optional(),
});

export const taskIdParamsSchema = z.object({
  id: z.uuid(),
});

export const taskListResponseSchema: z.ZodType<TaskListResponse> = z.object({
  data: z.array(taskSchema),
  meta: paginationMetaSchema,
});

export const singleTaskResponseSchema: z.ZodType<SingleTaskResponse> = z.object({
  data: taskSchema,
});

export const deleteManyTasksResponseSchema: z.ZodType<DeleteManyTasksResponse> = z.object({
  count: z.number(),
});

export const tasksErrorResponseSchema = sharedErrorResponseSchema;
