import type {
  CreateTaskInput,
  DeleteManyTasksInput,
  Task,
  TaskQuery,
  UpdateTaskInput,
  User,
} from "@repo/shared-types";

import { Prisma, type Task as PrismaTask } from "../../lib/prisma.js";
import { createHttpResult, type HttpResult } from "../../shared/http-result.js";
import { HttpStatus } from "../../shared/http-status.js";
import { tasksRepository } from "./tasks.repository.js";

const serializeTask = (task: PrismaTask): Task => {
  const { userId: _userId, ...rest } = task;

  return {
    ...rest,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
};

const serializeTasks = (tasks: PrismaTask[]) => tasks.map(serializeTask);

const hasCode = (error: unknown, code: string) => {
  return error instanceof Error && "code" in error && error.code === code;
};

const findOwnedTask = (currentUser: User, id: string) => {
  return tasksRepository.findOwned({
    id,
    userId: currentUser.id,
  });
};

const isDescendantTask = async (
  currentUser: User,
  taskId: string,
  possibleDescendantId: string,
) => {
  let currentId: string | null = possibleDescendantId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === taskId) {
      return true;
    }

    if (visited.has(currentId)) {
      return true;
    }

    visited.add(currentId);

    const task = await findOwnedTask(currentUser, currentId);
    currentId = task?.parentId ?? null;
  }

  return false;
};

const validateParentTask = async (
  currentUser: User,
  parentId: string | null | undefined,
  taskId?: string,
): Promise<HttpResult<null, typeof HttpStatus.NOT_FOUND | typeof HttpStatus.CONFLICT, typeof HttpStatus.OK>> => {
  if (!parentId) {
    return createHttpResult({
      status: HttpStatus.OK,
      data: null,
    });
  }

  const parentTask = await findOwnedTask(currentUser, parentId);

  if (!parentTask) {
    return createHttpResult({
      message: "Parent task not found",
      status: HttpStatus.NOT_FOUND,
    });
  }

  if (taskId && parentId === taskId) {
    return createHttpResult({
      message: "Task cannot be its own parent",
      status: HttpStatus.CONFLICT,
    });
  }

  if (taskId && (await isDescendantTask(currentUser, taskId, parentId))) {
    return createHttpResult({
      message: "Task parent would create a cycle",
      status: HttpStatus.CONFLICT,
    });
  }

  return createHttpResult({
    status: HttpStatus.OK,
    data: null,
  });
};

export const tasksService = {
  async post(
    currentUser: User,
    input: CreateTaskInput,
  ): Promise<
    HttpResult<Task, typeof HttpStatus.NOT_FOUND | typeof HttpStatus.CONFLICT, typeof HttpStatus.CREATED>
  > {
    try {
      const parentValidation = await validateParentTask(currentUser, input.parentId);

      if (!parentValidation.ok) {
        return parentValidation;
      }

      const task = await tasksRepository.create({
        title: input.title,
        description: input.description ?? null,
        priority: input.priority,
        status: input.status,
        dueDate: input.dueDate ?? null,
        tags: input.tags ?? [],
        userId: currentUser.id,
        parentId: input.parentId ?? null,
      });

      return createHttpResult({
        status: HttpStatus.CREATED,
        data: serializeTask(task),
      });
    } catch (error: unknown) {
      if (hasCode(error, "P2003")) {
        return createHttpResult({
          message: "Parent task not found",
          status: HttpStatus.NOT_FOUND,
        });
      }

      throw error;
    }
  },
  async getMany(currentUser: User, query: TaskQuery): Promise<{
    data: Task[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const safePage = Math.max(query.page, 1);
    const safeLimit = Math.min(query.limit, 50);
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.TaskWhereInput = {
      AND: [
        query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: "insensitive" } },
                { description: { contains: query.q, mode: "insensitive" } },
              ],
            }
          : {},
        { userId: currentUser.id },
        query.priority ? { priority: query.priority } : {},
        query.status ? { status: query.status } : {},
        query.dueDateStart || query.dueDateEnd
          ? {
              dueDate: {
                ...(query.dueDateStart && { gte: new Date(query.dueDateStart) }),
                ...(query.dueDateEnd && { lte: new Date(query.dueDateEnd) }),
              },
            }
          : {},
      ],
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput | undefined = query.sortBy
      ? {
          [query.sortBy]: query.order ?? "desc",
        }
      : undefined;

    const [tasks, total] = await Promise.all([
      tasksRepository.findMany({
        skip,
        take: safeLimit,
        where,
        orderBy,
      }),
      tasksRepository.count(where),
    ]);

    return {
      data: serializeTasks(tasks),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  },
  async getOne(
    currentUser: User,
    id: string,
  ): Promise<HttpResult<Task, typeof HttpStatus.NOT_FOUND, typeof HttpStatus.OK>> {
    const task = await tasksRepository.findOwned({
      id,
      userId: currentUser.id,
    });

    if (!task) {
      return createHttpResult({
        message: "Task not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: serializeTask(task),
    });
  },
  async patch(
    currentUser: User,
    id: string,
    input: UpdateTaskInput,
  ): Promise<
    HttpResult<Task, typeof HttpStatus.NOT_FOUND | typeof HttpStatus.CONFLICT, typeof HttpStatus.OK>
  > {
    const cleanData = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<UpdateTaskInput>;

    try {
      const existingTask = await tasksRepository.findOwned({
        id,
        userId: currentUser.id,
      });

      if (!existingTask) {
        return createHttpResult({
          message: "Task not found",
          status: HttpStatus.NOT_FOUND,
        });
      }

      if (cleanData.parentId !== undefined) {
        const parentValidation = await validateParentTask(
          currentUser,
          cleanData.parentId,
          existingTask.id,
        );

        if (!parentValidation.ok) {
          return parentValidation;
        }
      }

      const task = await tasksRepository.update(id, {
        ...cleanData,
      });

      return createHttpResult({
        status: HttpStatus.OK,
        data: serializeTask(task),
      });
    } catch (error: unknown) {
      if (hasCode(error, "P2025")) {
        return createHttpResult({
          message: "Task not found",
          status: HttpStatus.NOT_FOUND,
        });
      }

      if (hasCode(error, "P2003")) {
        return createHttpResult({
          message: "Parent task not found",
          status: HttpStatus.NOT_FOUND,
        });
      }

      throw error;
    }
  },
  async deleteMany(currentUser: User, input: DeleteManyTasksInput): Promise<{ count: number }> {
    const result = await tasksRepository.deleteMany({
      userId: currentUser.id,
      ids: input.ids,
    });

    return {
      count: result.count,
    };
  },
};
