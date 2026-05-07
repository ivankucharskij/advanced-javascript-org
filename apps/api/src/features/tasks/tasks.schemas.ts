import { z } from "@hono/zod-openapi";

import {
  errorResponseSchema as sharedErrorResponseSchema,
  paginationMetaSchema,
  paginationQuerySchema,
} from "../../shared/schemas.js";

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const taskSchema = z
  .object({
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

export const createTaskSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    priority: taskPrioritySchema,
    status: taskStatusSchema,
    dueDate: z.iso.datetime().nullable().optional(),
    tags: z.array(z.string()).optional(),
    parentId: z.uuid().nullable().optional(),
  });

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    priority: taskPrioritySchema.optional(),
    status: taskStatusSchema.optional(),
    dueDate: z.iso.datetime().nullable().optional(),
    tags: z.array(z.string()).optional(),
    parentId: z.uuid().nullable().optional(),
  });

export const deleteManyTasksSchema = z
  .object({
    ids: z.array(z.uuid()).min(1),
  });

export const taskQuerySchema = paginationQuerySchema.extend({
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

export const taskIdParamsSchema = z
  .object({
    id: z.uuid(),
  });

export const taskListResponseSchema = z
  .object({
    data: z.array(taskSchema),
    meta: paginationMetaSchema,
  });

export const singleTaskResponseSchema = z
  .object({
    data: taskSchema,
  });

export const deleteManyTasksResponseSchema = z
  .object({
    count: z.number(),
  });

export const tasksErrorResponseSchema = sharedErrorResponseSchema;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type DeleteManyTasksInput = z.infer<typeof deleteManyTasksSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
