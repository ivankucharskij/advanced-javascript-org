"use client";

import { useState } from "react";

export default function CheckApiPage() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    setResponse("");

    try {
      const result = await fetch("/api/healthz");
      const text = await result.text();

      setResponse(`${result.status} ${result.statusText}\n\n${text}`);
    } catch (error) {
      setResponse(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>API Check</h1>
      <button onClick={sendRequest} disabled={loading}>
        {loading ? "Sending..." : "Send request"}
      </button>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{response}</pre>
    </main>
  );
}
