import type { RegisterUserInput } from "@repo/shared-types";

import { prisma } from "../../lib/prisma.js";

export const usersRepository = {
  count() {
    return prisma.user.count();
  },
  create(
    input: Omit<RegisterUserInput, "birthDate"> & {
      birthDate: Date;
    },
  ) {
    return prisma.user.create({
      data: {
        ...input,
        role: "USER",
        status: "ACTIVE",
      },
    });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
  findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
  findMany(input: { skip: number; take: number }) {
    return prisma.user.findMany({
      skip: input.skip,
      take: input.take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  updateStatus(id: string, status: "ACTIVE" | "BLOCKED") {
    return prisma.user.update({
      where: { id },
      data: {
        status,
      },
    });
  },
};
