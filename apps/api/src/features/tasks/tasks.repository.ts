import { Prisma, prisma } from "../../lib/prisma.js";
import { CreateTaskInput, UpdateTaskInput } from "./tasks.schemas.js";

export const tasksRepository = {
  count(where: Prisma.TaskWhereInput) {
    return prisma.task.count({ where });
  },
  create(
    input: CreateTaskInput & {
      userId: string;
    },
  ) {
    return prisma.task.create({
      data: input,
    });
  },
  deleteMany(input: { ids: string[]; userId: string }) {
    return prisma.task.deleteMany({
      where: {
        userId: input.userId,
        id: {
          in: input.ids,
        },
      },
    });
  },
  findMany(input: {
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    skip: number;
    take: number;
    where: Prisma.TaskWhereInput;
  }) {
    return prisma.task.findMany(input);
  },
  findOwned(input: { id: string; userId: string }) {
    return prisma.task.findFirst({
      where: {
        id: input.id,
        userId: input.userId,
      },
    });
  },
  update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },
};
