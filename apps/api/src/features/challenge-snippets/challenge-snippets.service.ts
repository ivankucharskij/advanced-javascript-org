import type {
  ChallengeSnippet,
  ChallengeSnippetListQuery,
  ChallengeSnippetListResponse,
  CreateChallengeSnippetInput,
  DeleteChallengeSnippetResponse,
  UpdateChallengeSnippetInput,
} from "@repo/shared-types";

import {
  createHttpResult,
  type HttpResult,
  HttpStatus,
  type SuccessHttpResult,
} from "../../shared/http.js";
import { challengeSnippetsRepository } from "./challenge-snippets.repository.js";

export const challengeSnippetsService = {
  async create(
    input: CreateChallengeSnippetInput,
  ): Promise<
    HttpResult<
      ChallengeSnippet,
      never,
      typeof HttpStatus.CONFLICT,
      typeof HttpStatus.CREATED
    >
  > {
    const existingSnippet = await challengeSnippetsRepository.findBySlug(
      input.slug,
    );

    if (existingSnippet) {
      return createHttpResult({
        message: "Challenge snippet slug already exists",
        status: HttpStatus.CONFLICT,
      });
    }

    return createHttpResult({
      data: await challengeSnippetsRepository.create(input),
      status: HttpStatus.CREATED,
    });
  },
  async delete(
    id: string,
  ): Promise<
    HttpResult<
      DeleteChallengeSnippetResponse,
      never,
      typeof HttpStatus.CONFLICT | typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    const deletedSnippet = await challengeSnippetsRepository.delete(id);

    if (!deletedSnippet.id) {
      return createHttpResult({
        message: "Challenge snippet was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (deletedSnippet.isUsed) {
      return createHttpResult({
        message: "Challenge snippet is used by challenges",
        status: HttpStatus.CONFLICT,
      });
    }

    return createHttpResult({
      data: {
        id: deletedSnippet.id,
      },
      status: HttpStatus.OK,
    });
  },
  async list(
    query: ChallengeSnippetListQuery,
  ): Promise<
    SuccessHttpResult<
      ChallengeSnippetListResponse["data"],
      ChallengeSnippetListResponse["meta"],
      typeof HttpStatus.OK
    >
  > {
    const snippets = await challengeSnippetsRepository.list(query);

    return createHttpResult({
      data: snippets.data,
      meta: snippets.meta,
      status: HttpStatus.OK,
    });
  },
  async update(
    id: string,
    input: UpdateChallengeSnippetInput,
  ): Promise<
    HttpResult<
      ChallengeSnippet,
      never,
      typeof HttpStatus.CONFLICT | typeof HttpStatus.NOT_FOUND,
      typeof HttpStatus.OK
    >
  > {
    const existingSnippet = await challengeSnippetsRepository.findById(id);

    if (!existingSnippet) {
      return createHttpResult({
        message: "Challenge snippet was not found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (input.slug && input.slug !== existingSnippet.slug) {
      const snippetWithSlug = await challengeSnippetsRepository.findBySlug(
        input.slug,
      );

      if (snippetWithSlug) {
        return createHttpResult({
          message: "Challenge snippet slug already exists",
          status: HttpStatus.CONFLICT,
        });
      }
    }

    return createHttpResult({
      data: await challengeSnippetsRepository.update(id, input),
      status: HttpStatus.OK,
    });
  },
};
