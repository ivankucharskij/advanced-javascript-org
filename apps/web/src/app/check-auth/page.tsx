"use client";

import type {
  DiscardGuestSessionResponse,
  GuestSessionResponse,
  MeResponse,
  StartGuestSessionResponse,
} from "@repo/shared-types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetchers } from "@/lib/fetchers";

const startGoogleAuth = () => {
  window.location.assign("/api/auth/google");
};

export default function CheckAuthPage() {
  const {
    data: guestSession,
    error: guestSessionError,
    isLoading: isGuestSessionLoading,
    mutate: mutateGuestSession,
  } = useSWR<GuestSessionResponse>(
    "/api/guest-session",
    (url: string) => fetchers.get<GuestSessionResponse>(url),
  );
  const {
    data: currentUser,
    error: currentUserError,
    isLoading: isCurrentUserLoading,
    mutate: mutateCurrentUser,
  } = useSWR<MeResponse>(
    "/api/me",
    (url: string) => fetchers.get<MeResponse>(url),
    {
      shouldRetryOnError: false,
    },
  );
  const startGuestSessionMutation =
    useSWRMutation<StartGuestSessionResponse>(
      "/api/guest-session",
      (url: string) => fetchers.post<StartGuestSessionResponse>(url),
      {
        onSuccess: () => {
          void mutateGuestSession();
        },
      },
    );
  const checkGuestSessionMutation = useSWRMutation<GuestSessionResponse>(
    "/api/guest-session",
    (url: string) => fetchers.get<GuestSessionResponse>(url),
    {
      onSuccess: (data) => {
        void mutateGuestSession(data, { revalidate: false });
      },
    },
  );
  const discardGuestSessionMutation =
    useSWRMutation<DiscardGuestSessionResponse>(
      "/api/guest-session",
      (url: string) => fetchers.delete<DiscardGuestSessionResponse>(url),
      {
        onSuccess: () => {
          void mutateGuestSession();
        },
      },
  );
  const checkCurrentUserMutation = useSWRMutation<MeResponse>(
    "/api/me",
    (url: string) => fetchers.get<MeResponse>(url),
    {
      onSuccess: (data) => {
        void mutateCurrentUser(data, { revalidate: false });
      },
    },
  );
  const pendingAction =
    (startGuestSessionMutation.isMutating && "start-guest") ||
    (checkGuestSessionMutation.isMutating && "check-guest") ||
    (discardGuestSessionMutation.isMutating && "discard-guest") ||
    (checkCurrentUserMutation.isMutating && "check-user") ||
    null;
  const lastAction =
    startGuestSessionMutation.data ??
    checkGuestSessionMutation.data ??
    discardGuestSessionMutation.data ??
    checkCurrentUserMutation.data;
  const lastActionError =
    startGuestSessionMutation.error ??
    checkGuestSessionMutation.error ??
    discardGuestSessionMutation.error ??
    checkCurrentUserMutation.error;
  const isActionPending = pendingAction !== null;

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Auth Check</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button
          disabled={isActionPending}
          onClick={() => {
            void startGuestSessionMutation.trigger();
          }}
          type="button"
        >
          Start guest session
        </button>
        <button
          disabled={isActionPending}
          onClick={() => {
            void checkGuestSessionMutation.trigger();
          }}
          type="button"
        >
          Check guest session
        </button>
        <button
          disabled={isActionPending}
          onClick={() => {
            void discardGuestSessionMutation.trigger();
          }}
          type="button"
        >
          Discard guest session
        </button>
        <button onClick={startGoogleAuth} type="button">
          Continue with Google
        </button>
        <button
          disabled={isActionPending}
          onClick={() => {
            void checkCurrentUserMutation.trigger();
          }}
          type="button"
        >
          Check current user
        </button>
      </div>
      {pendingAction ? <p>Running {pendingAction}...</p> : null}
      <section style={{ marginTop: 16 }}>
        <h2>Guest session</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {isGuestSessionLoading
            ? "Loading..."
            : guestSessionError instanceof Error
              ? guestSessionError.message
              : JSON.stringify(guestSession, null, 2)}
        </pre>
      </section>
      <section style={{ marginTop: 16 }}>
        <h2>Current user</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {isCurrentUserLoading
            ? "Loading..."
            : currentUserError instanceof Error
              ? currentUserError.message
              : JSON.stringify(currentUser, null, 2)}
        </pre>
      </section>
      <h2>Last action</h2>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {lastActionError instanceof Error
          ? lastActionError.message
          : JSON.stringify(lastAction, null, 2)}
      </pre>
    </main>
  );
}
