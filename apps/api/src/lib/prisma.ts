import { PrismaPg } from "@prisma/adapter-pg";

import { getEnv } from "../config/env.js";
import {
  Prisma,
  PrismaClient,
  type User,
} from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: getEnv().DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { Prisma, prisma };
export type { User };
