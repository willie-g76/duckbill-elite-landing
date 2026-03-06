import type { BookingStep } from "@/hooks/use-scheduler";

const stepLabels = ["Contact", "Pick a Time", "Confirm"];

export default function BookingSteps({ current }: { current: BookingStep }) {
  // Map internal step 4 (success) to display as step 3 completed
  const displayStep = current === 4 ? 3 : current;

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepLabels.map((label, i) => {
        const stepNum = (i + 1) as BookingStep;
        const isActive = stepNum === displayStep;
        const isDone = stepNum < displayStep || current === 4;
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-0.5 ${isDone ? "bg-accent" : "bg-border"}`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : isDone
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? "\u2713" : stepNum}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive || isDone ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
