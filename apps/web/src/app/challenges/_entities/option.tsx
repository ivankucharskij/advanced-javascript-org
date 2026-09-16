import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/cn";

export function Option({
  disabled,
  isCorrect,
  isSelected,
  label,
  onSelect,
}: {
  disabled: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}) {
  const showCorrect = disabled && isCorrect;
  const showIncorrect = disabled && isSelected && !isCorrect;

  return (
    <button
      className={cn(
        "grid min-h-12 grid-cols-[24px_minmax(0,1fr)] items-center gap-3 rounded-md border bg-fd-card px-3 py-2 text-left transition",
        !disabled && "hover:bg-fd-accent",
        showCorrect && "border-green-600/60 bg-green-600/10",
        showIncorrect && "border-red-600/60 bg-red-600/10",
      )}
      disabled={disabled}
      onClick={onSelect}
      type="button"
    >
      <span className="flex size-6 items-center justify-center">
        {showCorrect ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : showIncorrect ? (
          <XCircle className="size-5 text-red-600" />
        ) : (
          <span className="size-2 rounded-full bg-fd-muted-foreground" />
        )}
      </span>
      <span className="text-sm leading-6">{label}</span>
    </button>
  );
}
