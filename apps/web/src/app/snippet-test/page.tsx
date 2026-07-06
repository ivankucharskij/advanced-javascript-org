"use client";

import type {
  AdminSessionResponse,
  ChallengeListResponse,
} from "@repo/shared-types";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import ky from "ky";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export default function SnippetTestPage() {
  const [adminCode, setAdminCode] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminTokenExpiresAt, setAdminTokenExpiresAt] = useState<string | null>(
    null,
  );
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
