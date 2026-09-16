import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

import { challengeApi } from "@/api/challenges";
import ChallengesDashboard from "@/app/challenges/_entities/challenges-dashboard";
import Header from "@/app/challenges/_entities/header";
import { Dashboard } from "@/app/challenges/_features/dashboard";
import ElementStates from "@/app/challenges/_features/element-states";

export default function Challenges() {
  const router = useRouter();
  const [isAuthPromptDismissed, setIsAuthPromptDismissed] = useState(false);
  const {
    data: dashboardResponse,
    error,
    isLoading,
  } = useSWR("/api/challenges/dashboard", () => challengeApi.dashboard(), {
    shouldRetryOnError: false,
  });
  const dashboard = dashboardResponse?.data ?? null;
  const isGuest = dashboard ? dashboard.greetingName === null : false;
  const showAuthPrompt =
    dashboard !== null &&
    isGuest &&
    !dashboard.authRequired &&
    !isAuthPromptDismissed;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid content-start gap-5">
        <Header title={"Challenges"} homeLink={"/array-methods"} />

        <ElementStates
          isLoading={isLoading}
          error={error}
          authRequired={dashboard?.authRequired ?? false}
        >
          {dashboard ? <ChallengesDashboard dashboard={dashboard} /> : null}
        </ElementStates>
      </section>

      {dashboard ? (
        <Dashboard
          dashboard={dashboard}
          onDismissAuthPrompt={() => {
            setIsAuthPromptDismissed(true);
          }}
          onPracticeWrongAnswers={() => {
            router.push("/challenges/review");
          }}
          showAuthPrompt={showAuthPrompt}
        />
      ) : null}
    </main>
  );
}
