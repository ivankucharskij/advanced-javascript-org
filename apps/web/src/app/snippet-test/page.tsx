"use client";

import type {
  AdminSessionResponse,
  ChallengeListResponse,
  CreateChallengeInput,
  CreateChallengeSnippetInput,
  ErrorResponse,
  SingleChallengeResponse,
  SingleChallengeSnippetResponse,
} from "@repo/shared-types";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import ky from "ky";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { seedChallenges } from "./seed-challenges";
import { snippets } from "./snippets";

const challengeSnippets = snippets as CreateChallengeSnippetInput[];
const challengesToSeed = seedChallenges as CreateChallengeInput[];

type SeedImportResult = {
  created: number;
  failed: Array<{
    message: string;
    slug: string;
    status: number;
  }>;
  skipped: number;
  total: number;
};

export default function SnippetTestPage() {
  const [adminCode, setAdminCode] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminTokenExpiresAt, setAdminTokenExpiresAt] = useState<string | null>(
    null,
  );
  const [snippetImportProgress, setSnippetImportProgress] = useState(0);
  const [challengeImportProgress, setChallengeImportProgress] = useState(0);
  const adminSessionMutation = useSWRMutation<
    AdminSessionResponse,
    Error,
    string,
    { code: string }
  >(
    "/api/admin/session",
    (url, { arg }) =>
      ky
        .post(url, {
          credentials: "include",
          json: { code: arg.code },
        })
        .json<AdminSessionResponse>(),
    {
      onError: () => {
        setAdminToken(null);
        setAdminTokenExpiresAt(null);
      },
      onSuccess: (result) => {
        setAdminToken(result.data.accessToken);
        setAdminTokenExpiresAt(result.data.expiresAt);
        setAdminCode("");
      },
    },
  );
  const {
    data: challenges,
    error: challengesError,
    isLoading: isChallengesLoading,
  } = useSWR<ChallengeListResponse>(
    adminToken ? ["/api/challenges?slug=fill", adminToken] : null,
    ([url, token]: [string, string]) =>
      ky
        .get(url, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json<ChallengeListResponse>(),
    {
      shouldRetryOnError: false,
    },
  );
  const snippetsMutation = useSWRMutation<
    SeedImportResult,
    Error,
    string,
    { token: string }
  >("/api/challenge-snippets/import", async (_key, { arg }) => {
    const result: SeedImportResult = {
      created: 0,
      failed: [],
      skipped: 0,
      total: challengeSnippets.length,
    };

    setSnippetImportProgress(0);

    for (const [index, snippet] of challengeSnippets.entries()) {
      const response = await ky.post("/api/challenge-snippets", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
        json: snippet,
        throwHttpErrors: false,
      });

      if (response.status === 201) {
        await response.json<SingleChallengeSnippetResponse>();
        result.created += 1;
      } else if (response.status === 409) {
        result.skipped += 1;
      } else {
        const error = await response.json<ErrorResponse>().catch(() => ({
          message: response.statusText || "Request failed",
        }));

        result.failed.push({
          message: error.message,
          slug: snippet.slug,
          status: response.status,
        });
      }

      setSnippetImportProgress(index + 1);
    }

    return result;
  });
  const challengesMutation = useSWRMutation<
    SeedImportResult,
    Error,
    string,
    { token: string }
  >("/api/challenges/import", async (_key, { arg }) => {
    const result: SeedImportResult = {
      created: 0,
      failed: [],
      skipped: 0,
      total: challengesToSeed.length,
    };

    setChallengeImportProgress(0);

    for (const [index, challenge] of challengesToSeed.entries()) {
      const response = await ky.post("/api/challenges", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
        json: challenge,
        throwHttpErrors: false,
      });

      if (response.status === 201) {
        await response.json<SingleChallengeResponse>();
        result.created += 1;
      } else if (response.status === 409) {
        result.skipped += 1;
      } else {
        const error = await response.json<ErrorResponse>().catch(() => ({
          message: response.statusText || "Request failed",
        }));

        result.failed.push({
          message: error.message,
          slug: challenge.slug,
          status: response.status,
        });
      }

      setChallengeImportProgress(index + 1);
    }

    return result;
  });
  const challenge = challenges?.data[0];

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8">
      <header className="grid gap-2">
        <p className="text-sm font-medium text-fd-muted-foreground">
          {challenge
            ? `${challenge.topicSlug} / ${challenge.slug}`
            : "Snippet test"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {challenge?.title ?? "Snippet Test"}
        </h1>
      </header>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Admin auth</h2>
        <form
          className="flex flex-wrap items-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void adminSessionMutation.trigger({ code: adminCode });
          }}
        >
          <input
            className="min-w-64 rounded border bg-transparent px-3 py-2"
            disabled={adminSessionMutation.isMutating}
            onChange={(event) => {
              setAdminCode(event.target.value);
            }}
            placeholder="Admin code"
            type="password"
            value={adminCode}
          />
          <button
            className="rounded border px-3 py-2"
            disabled={adminSessionMutation.isMutating || adminCode.length === 0}
            type="submit"
          >
            Authorize
          </button>
        </form>
        {adminSessionMutation.isMutating ? <p>Authorizing...</p> : null}
        {adminSessionMutation.error instanceof Error ? (
          <pre className="whitespace-pre-wrap">
            {adminSessionMutation.error.message}
          </pre>
        ) : null}
        {adminTokenExpiresAt ? (
          <p className="text-sm text-fd-muted-foreground">
            Admin token expires at {adminTokenExpiresAt}
          </p>
        ) : null}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Seed data</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!adminToken || snippetsMutation.isMutating}
            onClick={() => {
              if (!adminToken) return;

              void snippetsMutation.trigger({ token: adminToken });
            }}
            type="button"
          >
            {snippetsMutation.isMutating
              ? "Adding snippets..."
              : `Add ${challengeSnippets.length} snippets`}
          </button>
          <p className="text-sm text-fd-muted-foreground">
            Posts each reusable snippet to /api/challenge-snippets.
          </p>
        </div>
        {snippetsMutation.isMutating ? (
          <p className="text-sm text-fd-muted-foreground">
            Added {snippetImportProgress} of {challengeSnippets.length}
          </p>
        ) : null}
        {snippetsMutation.data ? (
          <div className="grid gap-2 text-sm">
            <p>
              Created {snippetsMutation.data.created}, skipped{" "}
              {snippetsMutation.data.skipped}, failed{" "}
              {snippetsMutation.data.failed.length}.
            </p>
            {snippetsMutation.data.failed.length > 0 ? (
              <pre className="whitespace-pre-wrap rounded border p-3 text-red-600">
                {snippetsMutation.data.failed
                  .map(
                    (failure) =>
                      `${failure.slug}: ${failure.status} ${failure.message}`,
                  )
                  .join("\n")}
              </pre>
            ) : null}
          </div>
        ) : null}
        {snippetsMutation.error instanceof Error ? (
          <pre className="whitespace-pre-wrap">
            {snippetsMutation.error.message}
          </pre>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!adminToken || challengesMutation.isMutating}
            onClick={() => {
              if (!adminToken) return;

              void challengesMutation.trigger({ token: adminToken });
            }}
            type="button"
          >
            {challengesMutation.isMutating
              ? "Adding challenges..."
              : `Add ${challengesToSeed.length} challenges`}
          </button>
          <p className="text-sm text-fd-muted-foreground">
            Posts each challenge to /api/challenges.
          </p>
        </div>
        {challengesMutation.isMutating ? (
          <p className="text-sm text-fd-muted-foreground">
            Added {challengeImportProgress} of {challengesToSeed.length}
          </p>
        ) : null}
        {challengesMutation.data ? (
          <div className="grid gap-2 text-sm">
            <p>
              Created {challengesMutation.data.created}, skipped{" "}
              {challengesMutation.data.skipped}, failed{" "}
              {challengesMutation.data.failed.length}.
            </p>
            {challengesMutation.data.failed.length > 0 ? (
              <pre className="whitespace-pre-wrap rounded border p-3 text-red-600">
                {challengesMutation.data.failed
                  .map(
                    (failure) =>
                      `${failure.slug}: ${failure.status} ${failure.message}`,
                  )
                  .join("\n")}
              </pre>
            ) : null}
          </div>
        ) : null}
        {challengesMutation.error instanceof Error ? (
          <pre className="whitespace-pre-wrap">
            {challengesMutation.error.message}
          </pre>
        ) : null}
      </section>

      <section>
        {!adminToken ? (
          <p className="text-fd-muted-foreground">
            Enter the admin code to load the snippet.
          </p>
        ) : isChallengesLoading ? (
          <p className="text-fd-muted-foreground">Loading...</p>
        ) : challengesError instanceof Error ? (
          <pre className="whitespace-pre-wrap">{challengesError.message}</pre>
        ) : challenge?.code ? (
          <DynamicCodeBlock lang="js" code={challenge.code} />
        ) : (
          <p className="text-fd-muted-foreground">
            Challenge code was not found.
          </p>
        )}
      </section>
    </main>
  );
}
