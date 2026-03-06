import { cn } from "@/lib/utils";

interface TimeChipProps {
  time: string;
  memberName: string;
  clustered: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function TimeChip({ time, memberName, clustered, selected, onClick }: TimeChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border-2 transition-all text-left",
        selected
          ? "border-accent bg-accent/10 shadow-md"
          : "border-border bg-card hover:border-accent/50 hover:shadow-sm",
        clustered && !selected && "border-green-300 bg-green-50/50"
      )}
    >
      <span className="text-sm font-semibold text-foreground">{time}</span>
      <span className="text-xs text-muted-foreground">{memberName}</span>
      {clustered && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          nearby
        </span>
      )}
    </button>
  );
}
