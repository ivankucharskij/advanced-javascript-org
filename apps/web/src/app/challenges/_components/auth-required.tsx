import { LogIn } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function AuthRequired({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section className="grid gap-3 rounded-md border bg-fd-card p-4">
      <div className="flex items-start gap-3">
        <LogIn className="mt-0.5 size-5 text-brand" />
        <div className="grid gap-1">
          <h2 className="text-base font-medium">Sign in to keep going</h2>
          <p className="text-sm leading-6 text-fd-muted-foreground">
            Your guest challenge progress is ready to merge into a Google
            account.
          </p>
        </div>
      </div>
      <button
        className={cn(
          buttonVariants({ variant: "primary" }),
          "w-fit gap-2 px-3",
        )}
        onClick={onSignIn}
        type="button"
      >
        <LogIn className="size-4" />
        Continue with Google
      </button>
    </section>
  );
}
