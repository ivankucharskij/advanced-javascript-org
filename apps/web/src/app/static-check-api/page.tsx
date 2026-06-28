import type { HealthCheckResponse } from "@repo/shared-types";

import { getEnv } from "@/lib/env-config";

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

const getHealthUrl = () => {
  const apiUrl = getEnv().LOCAL_API_URL;
  return `${apiUrl.replace(/\/$/, "")}/api/healthz`;
};

async function getStaticHealth(): Promise<StaticHealthResult> {
  const url = getHealthUrl();
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });
    const text = await response.text();

    if (!response.ok) {
      return {
        error: `${response.status} ${response.statusText}\n\n${text}`,
        fetchedAt,
        ok: false,
        url,
      };
    }

    return {
      data: JSON.parse(text) as HealthCheckResponse,
      fetchedAt,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      url,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      fetchedAt,
      ok: false,
      url,
    };
  }
}

export default async function StaticCheckApiPage() {
  const result = await getStaticHealth();

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Static API Check</h1>
      <p>
        This page is statically prerendered. The API request runs on the server
        during prerendering.
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
