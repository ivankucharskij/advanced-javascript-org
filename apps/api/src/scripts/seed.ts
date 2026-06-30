import "dotenv/config";

import { prisma } from "../lib/prisma.js";

const main = async () => {
  await prisma.$queryRaw`SELECT 1`;

  console.info("Seed completed. No auth users are seeded for Google-only auth.");
};

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
