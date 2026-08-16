export function Mode({
  isRestarting,
  mode,
  onRestart,
  onShowPractice,
}: {
  isRestarting: boolean;
  mode: "practice" | "review";
  onRestart: () => void;
  onShowPractice: () => void;
}) {
  return (
    <section className="grid gap-3 rounded-md border bg-fd-card p-4">
      <h2 className="text-base font-medium">
        {mode === "review" ? "No wrong answers" : "No challenges found"}
      </h2>
      {mode === "practice" ? (
        <button
          className="w-fit rounded-md border px-3 py-2 text-sm"
          disabled={isRestarting}
          onClick={onRestart}
          type="button"
        >
          {isRestarting ? "Starting..." : "Start again"}
        </button>
      ) : (
        <button
          className="w-fit rounded-md border px-3 py-2 text-sm"
          onClick={onShowPractice}
          type="button"
        >
          Back to practice
        </button>
      )}
    </section>
  );
}
