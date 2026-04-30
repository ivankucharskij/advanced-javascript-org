import "dotenv/config";

import { prisma, type User as PrismaUser } from "@repo/database/client";

import { hashPassword, normalizeEmail } from "../features/users/password.js";

const seededUsers = [
  {
    email: "admin@example.com",
    password: "admin12345",
    fullName: "System Administrator",
    birthDate: "1990-01-01",
    role: "ADMIN" as const,
  },
  {
    email: "user@example.com",
    password: "user12345",
    fullName: "Demo User",
    birthDate: "1995-05-15",
    role: "USER" as const,
  },
];

const taskSeeds = {
  "admin@example.com": [
    {
      title: "Review user management",
      description: "Check admin-only screens and user blocking flow.",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      dueDateOffsetDays: 2,
      tags: ["seed", "admin", "users"],
    },
    {
      title: "Prepare API documentation",
      description: "Validate OpenAPI responses and Swagger examples.",
      priority: "MEDIUM" as const,
      status: "TODO" as const,
      dueDateOffsetDays: 5,
      tags: ["seed", "admin", "docs"],
    },
  ],
  "user@example.com": [
    {
      title: "Plan weekly tasks",
      description: "Prioritize the task list and set realistic deadlines.",
      priority: "MEDIUM" as const,
      status: "TODO" as const,
      dueDateOffsetDays: 1,
      tags: ["seed", "user", "planning"],
    },
    {
      title: "Finish profile setup",
      description: "Confirm account details and check task filters.",
      priority: "LOW" as const,
      status: "DONE" as const,
      dueDateOffsetDays: -1,
      tags: ["seed", "user", "profile"],
    },
  ],
};

const dateFromOffset = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(12, 0, 0, 0);

  return date;
};

const main = async () => {
  const users: PrismaUser[] = await Promise.all(
    seededUsers.map(async (user) => {
      const password = await hashPassword(user.password);

      return prisma.user.upsert({
        where: {
          email: normalizeEmail(user.email),
        },
        update: {
          fullName: user.fullName,
          birthDate: new Date(`${user.birthDate}T00:00:00.000Z`),
          password,
          role: user.role,
          status: "ACTIVE",
        },
        create: {
          fullName: user.fullName,
          birthDate: new Date(`${user.birthDate}T00:00:00.000Z`),
          email: normalizeEmail(user.email),
          password,
          role: user.role,
          status: "ACTIVE",
        },
      });
    }),
  );

  await prisma.task.deleteMany({
    where: {
      userId: {
        in: users.map((user) => user.id),
      },
      tags: {
        has: "seed",
      },
    },
  });

  for (const user of users) {
    const tasks = taskSeeds[user.email as keyof typeof taskSeeds] ?? [];

    for (const task of tasks) {
      await prisma.task.create({
        data: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: dateFromOffset(task.dueDateOffsetDays),
          tags: task.tags,
          userId: user.id,
        },
      });
    }
  }

  console.info("Seed completed.");
  console.info("Admin: admin@example.com / admin12345");
  console.info("User: user@example.com / user12345");
};

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
