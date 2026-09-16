import { PropsWithChildren } from "react";

import { AuthRequired } from "@/app/challenges/_entities/auth-required";

export default function ElementStates({
  isLoading,
  error,
  authRequired,
  children,
}: PropsWithChildren<{
  isLoading: boolean;
  error: Error;
  authRequired: boolean;
}>) {
  if (isLoading) return <p className="text-fd-muted-foreground">Loading...</p>;

  if (error.message) {
    return (
      <pre className="whitespace-pre-wrap rounded-md border bg-fd-card p-4 text-sm text-red-600">
        {error.message}
      </pre>
    );
  }

  if (authRequired) {
    return <AuthRequired />;
  }

  return children;
}
