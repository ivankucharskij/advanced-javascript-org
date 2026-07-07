import type {
  ChallengeAnswerInput,
  ChallengeAnswerResponse,
  ChallengeDashboardResponse,
  ChallengeRestartResponse,
  ChallengeSessionMode,
  ChallengeSessionResponse,
} from "@repo/shared-types";

import { fetchers } from "@/lib/fetchers";

export const challengeApi = {
  answer(challengeId: string, input: ChallengeAnswerInput) {
    return fetchers.post<ChallengeAnswerResponse, ChallengeAnswerInput>(
      `/api/challenges/${challengeId}/answer`,
      input,
    );
  },
  dashboard() {
    return fetchers.get<ChallengeDashboardResponse>(
      "/api/challenges/dashboard",
    );
  },
  next(mode: ChallengeSessionMode) {
    return fetchers.get<ChallengeSessionResponse>(
      `/api/challenges/next?mode=${mode}`,
    );
  },
  restart() {
    return fetchers.post<ChallengeRestartResponse>("/api/challenges/restart");
  },
};
