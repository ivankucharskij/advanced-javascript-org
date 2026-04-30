import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  Prisma,
  PrismaClient,
  Task,
  User,
} from "../generated/prisma/client.js";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

loadEnv({ path: path.join(packageDir, ".env"), quiet: true });

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { Prisma, prisma };
export type { Task, User };
