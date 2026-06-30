import type { HealthCheckResponse } from "@repo/shared-types";
import ky from "ky";

import { getEnv } from "@/lib/env-config";

export const dynamic = "force-dynamic";

type StaticHealthResult =
  | {
      data: HealthCheckResponse;
      fetchedAt: string;
      ok: true;
      status: number;
      statusText: string;
      url: string;
    }
  | {
      error: string;
      fetchedAt: string;
      ok: false;
      url: string;
    };

async function getStaticHealth(): Promise<StaticHealthResult> {
  const api = ky.create({
    cache: "no-store",
    prefix: getEnv().LOCAL_API_URL,
    throwHttpErrors: false,
  });
  const fetchedAt = new Date().toISOString();

  try {
    const response = await api.get("api/healthz");
    const text = await response.text();

    if (!response.ok) {
      return {
        error: `${response.status} ${response.statusText}\n\n${text}`,
        fetchedAt,
        ok: false,
        url: response.url,
      };
    }

    return {
      data: JSON.parse(text) as HealthCheckResponse,
      fetchedAt,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      fetchedAt,
      ok: false,
      url: "api/healthz",
    };
  }
}

export default async function StaticCheckApiPage() {
  const result = await getStaticHealth();

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Static API Check</h1>
      <p>
        This page runs on the server. The API request is sent from Next.js to
        the internal API at request time.
      </p>
      <dl>
        <dt>URL</dt>
        <dd>{result.url}</dd>
        <dt>Fetched at</dt>
        <dd>{result.fetchedAt}</dd>
      </dl>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {result.ok
          ? `${result.status} ${result.statusText}\n\n${JSON.stringify(result.data, null, 2)}`
          : result.error}
      </pre>
    </main>
  );
}
