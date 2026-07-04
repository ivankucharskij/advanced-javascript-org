import type {
  ChallengeListQuery,
  ChallengeListResponse,
  ChallengeWithAnswer,
  CreateChallengeInput,
  DeleteChallengeResponse,
  UpdateChallengeInput,
} from "@repo/shared-types";

import {
  createHttpResult,
  type HttpResult,
  HttpStatus,
  type SuccessHttpResult,
} from "../../shared/http.js";
import { challengeSnippetsRepository } from "../challenge-snippets/challenge-snippets.repository.js";
import { challengesRepository } from "./challenges.repository.js";

export const challengesService = {
  async create(
    input: CreateChallengeInput,
  ): Promise<
    HttpResult<
      ChallengeWithAnswer,
      never,
      typeof HttpStatus.CONFLICT | typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.CREATED
    >
  > {
    const existingChallenge = await challengesRepository.findBySlug(input.slug);

    if (existingChallenge) {
      return createHttpResult({
        message: "Challenge slug already exists",
        status: HttpStatus.CONFLICT,
      });
    }

    const existingSnippet = await challengeSnippetsRepository.findById(
      input.snippetId,
    );

    if (!existingSnippet) {
      return createHttpResult({
        message: "Challenge snippet was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return createHttpResult({
      data: await challengesRepository.create(input),
      status: HttpStatus.CREATED,
    });
  },
  async delete(
    id: string,
  ): Promise<
    HttpResult<
      DeleteChallengeResponse,
      never,
      typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    const deletedId = await challengesRepository.delete(id);

    if (!deletedId) {
      return createHttpResult({
        message: "Challenge was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return createHttpResult({
      data: {
        id: deletedId,
      },
      status: HttpStatus.OK,
    });
  },
  async list(
    query: ChallengeListQuery,
  ): Promise<
    SuccessHttpResult<
      ChallengeListResponse["data"],
      ChallengeListResponse["meta"],
      typeof HttpStatus.OK
    >
  > {
    const challenges = await challengesRepository.list(query);

    return createHttpResult({
      data: challenges.data,
      meta: challenges.meta,
      status: HttpStatus.OK,
    });
  },
  async update(
    id: string,
    input: UpdateChallengeInput,
  ): Promise<
    HttpResult<
      ChallengeWithAnswer,
      never,
      typeof HttpStatus.CONFLICT | typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    const existingChallenge = await challengesRepository.findById(id);

    if (!existingChallenge) {
      return createHttpResult({
        message: "Challenge was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (input.slug && input.slug !== existingChallenge.slug) {
      const challengeWithSlug = await challengesRepository.findBySlug(
        input.slug,
      );

      if (challengeWithSlug) {
        return createHttpResult({
          message: "Challenge slug already exists",
          status: HttpStatus.CONFLICT,
        });
      }
    }

    if (input.snippetId) {
      const existingSnippet = await challengeSnippetsRepository.findById(
        input.snippetId,
      );

      if (!existingSnippet) {
        return createHttpResult({
          message: "Challenge snippet was not found",
          status: HttpStatus.NOT_FOUND,
        });
      }
    }

    return createHttpResult({
      data: await challengesRepository.update(id, input),
      status: HttpStatus.OK,
    });
  },
};
