"use client";

import type { HealthCheckResponse } from "@repo/shared-types";
import ky from "ky";
import useSWRMutation from "swr/mutation";

const checkApiHealth = async (url: string) =>
  ky.get(url).json<HealthCheckResponse>();

export default function CheckApiPage() {
  const { data, error, isMutating, trigger } = useSWRMutation(
    "/api/healthz",
    checkApiHealth,
  );

  const response =
    error instanceof Error
      ? error.message
      : data
        ? JSON.stringify(data, null, 2)
        : "";

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>API Check</h1>
      <button
        onClick={() => void trigger(undefined, { throwOnError: false })}
        disabled={isMutating}
      >
        {isMutating ? "Sending..." : "Send request"}
      </button>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{response}</pre>
    </main>
  );
}
