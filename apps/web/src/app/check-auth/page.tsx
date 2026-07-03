"use client";

import type { MeResponse } from "@repo/shared-types";
import ky from "ky";
import { useState } from "react";

const startGoogleAuth = () => {
  window.location.assign("/api/auth/google");
};

export default function CheckAuthPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [response, setResponse] = useState("");

  const checkCurrentUser = async () => {
    setIsChecking(true);

    try {
      const me = await ky
        .get("/api/me", {
          credentials: "include",
        })
        .json<MeResponse>();

      setResponse(JSON.stringify(me, null, 2));
    } catch (error) {
      setResponse(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Auth Check</h1>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={startGoogleAuth} type="button">
          Continue with Google
        </button>
        <button disabled={isChecking} onClick={checkCurrentUser} type="button">
          {isChecking ? "Checking..." : "Check current user"}
        </button>
      </div>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{response}</pre>
    </main>
  );
}
