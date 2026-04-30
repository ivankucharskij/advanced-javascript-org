import { PrismaPg } from "@prisma/adapter-pg";

import {
  Prisma,
  PrismaClient,
  type Task,
  type User,
} from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { Prisma, prisma };
export type { Task, User };
