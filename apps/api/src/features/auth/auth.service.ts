import type { User } from "@repo/shared-types";
import { z } from "zod";

import {
  createHttpResult,
  type HttpResult,
  HttpStatus,
} from "../../shared/http.js";
import { guestSessionsService } from "../guest-sessions/guest-sessions.service.js";
import { authRepository } from "./auth.repository.js";
import { createAccessToken, parseAccessToken } from "./tokens.js";

type GoogleProfile = {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
};

type GoogleSignInResult = {
  accessToken: string;
  guestSessionMerge: {
    discarded: boolean;
    guestSessionId: string | null;
    mergedProgressCount: number;
  };
  user: User;
};

const googleProfileSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  name: z.string().min(1).optional(),
  picture: z.url().optional(),
  verified_email: z.boolean().optional(),
});

export const authService = {
  async authorize(
    authorizationHeader?: string,
  ): Promise<
    HttpResult<
      User,
      never,
      typeof HttpStatus.UNAUTHORIZED,
      typeof HttpStatus.OK
    >
  > {
    if (!authorizationHeader?.startsWith("Bearer ")) {
      return createHttpResult({
        message: "Missing access token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    const payload = await parseAccessToken(token);

    if (!payload?.sub) {
      return createHttpResult({
        message: "Invalid token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const user = await authRepository.findUserById(payload.sub);

    if (!user) {
      return createHttpResult({
        message: "Invalid token",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    return createHttpResult({
      status: HttpStatus.OK,
      data: user,
    });
  },
  async signInWithGoogle(
    googleProfile: GoogleProfile | undefined,
    guestSessionId?: string,
  ): Promise<
    HttpResult<
      GoogleSignInResult,
      never,
      typeof HttpStatus.UNAUTHORIZED,
      typeof HttpStatus.OK
    >
  > {
    const parsedGoogleProfile = googleProfileSchema.safeParse(googleProfile);

    if (!parsedGoogleProfile.success) {
      return createHttpResult({
        message: "Google profile was not returned",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    if (parsedGoogleProfile.data.verified_email === false) {
      return createHttpResult({
        message: "Google email is not verified",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const user = await authRepository.upsertGoogleUser({
      avatarUrl: parsedGoogleProfile.data.picture ?? null,
      email: parsedGoogleProfile.data.email,
      fullName: parsedGoogleProfile.data.name ?? parsedGoogleProfile.data.email,
      providerAccountId: parsedGoogleProfile.data.id,
    });

    const guestSessionMerge = await guestSessionsService.mergeIntoUser(
      user.id,
      guestSessionId,
    );

    return createHttpResult({
      status: HttpStatus.OK,
      data: {
        accessToken: await createAccessToken(user.id),
        guestSessionMerge,
        user,
      },
    });
  },
};
