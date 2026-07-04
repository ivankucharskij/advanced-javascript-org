import type { GuestSessionSummary } from "@repo/shared-types";

import {
  createHttpResult,
  type HttpResult,
  HttpStatus,
  type SuccessHttpResult,
} from "../../shared/http.js";
import { guestSessionsRepository } from "./guest-sessions.repository.js";

type DiscardGuestSessionResult = {
  discarded: boolean;
  id: string | null;
};

type FindOrCreateGuestSessionResult = {
  created: boolean;
  guestSession: GuestSessionSummary;
};

export const guestSessionsService = {
  async discard(
    guestSessionId: string | undefined,
  ): Promise<
    HttpResult<
      DiscardGuestSessionResult,
      never,
      typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    if (!guestSessionId) {
      return createHttpResult({
        data: {
          discarded: false,
          id: null,
        },
        status: HttpStatus.OK,
      });
    }

    const id = await guestSessionsRepository.discard(guestSessionId);

    if (!id) {
      return createHttpResult({
        message: "Guest session was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return createHttpResult({
      data: {
        discarded: true,
        id,
      },
      status: HttpStatus.OK,
    });
  },
  async find(
    guestSessionId: string | undefined,
  ): Promise<
    SuccessHttpResult<GuestSessionSummary | null, never, typeof HttpStatus.OK>
  > {
    if (!guestSessionId) {
      return createHttpResult({
        data: null,
        status: HttpStatus.OK,
      });
    }

    return createHttpResult({
      data: await guestSessionsRepository.find(guestSessionId),
      status: HttpStatus.OK,
    });
  },
  async findOrCreate(
    guestSessionId: string | undefined,
  ): Promise<
    SuccessHttpResult<
      FindOrCreateGuestSessionResult,
      never,
      typeof HttpStatus.CREATED
    >
  > {
    return createHttpResult({
      data: await guestSessionsRepository.findOrCreate(guestSessionId),
      status: HttpStatus.CREATED,
    });
  },
  mergeIntoUser(userId: string, guestSessionId: string | undefined) {
    return guestSessionsRepository.mergeIntoUser(userId, guestSessionId);
  },
};
