import { prisma } from "../../lib/prisma.js";

export const authRepository = {
  findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
  upsertGoogleUser(input: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
    providerAccountId: string;
  }) {
    return prisma.user.upsert({
      where: {
        email: input.email,
      },
      update: {
        avatarUrl: input.avatarUrl,
        fullName: input.fullName,
        oauthAccounts: {
          connectOrCreate: {
            create: {
              email: input.email,
              provider: "google",
              providerAccountId: input.providerAccountId,
            },
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: input.providerAccountId,
              },
            },
          },
        },
      },
      create: {
        avatarUrl: input.avatarUrl,
        email: input.email,
        fullName: input.fullName,
        oauthAccounts: {
          create: {
            email: input.email,
            provider: "google",
            providerAccountId: input.providerAccountId,
          },
        },
      },
    });
  },
};
