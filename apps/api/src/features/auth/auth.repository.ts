import { prisma } from "../../lib/prisma.js";

type UpsertGoogleUserInput = {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  providerAccountId: string;
};

export const authRepository = {
  findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },
  upsertGoogleUser(input: UpsertGoogleUserInput) {
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
