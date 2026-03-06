import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeChip from "./TimeChip";
import type { Slot } from "@/hooks/use-scheduler";

interface SlotPickerProps {
  slots: Slot[];
  loading: boolean;
  timezone: string;
  onSelect: (slot: Slot, memberId: string) => void;
  onBack: () => void;
}

interface DayGroup {
  dateKey: string;
  label: string;
  slots: Slot[];
  hasClustered: boolean;
}

export default function SlotPicker({ slots, loading, timezone, onSelect, onBack }: SlotPickerProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ slotIdx: string; memberId: string } | null>(null);

  const dayGroups = useMemo(() => {
    const groups = new Map<string, DayGroup>();

    for (const slot of slots) {
      const d = new Date(slot.start);
      const dateKey = d.toLocaleDateString("en-CA", { timeZone: timezone });
      const label = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      });

      if (!groups.has(dateKey)) {
        groups.set(dateKey, { dateKey, label, slots: [], hasClustered: false });
      }
      const group = groups.get(dateKey)!;
      group.slots.push(slot);
      if (slot.clustered) group.hasClustered = true;
    }

    return Array.from(groups.values());
  }, [slots, timezone]);

  // Auto-expand first day
  useMemo(() => {
    if (dayGroups.length > 0 && !expandedDay) {
      setExpandedDay(dayGroups[0].dateKey);
    }
  }, [dayGroups]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-muted-foreground">Finding available times in your area...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground font-medium mb-2">No available slots right now</p>
        <p className="text-muted-foreground mb-6">
          Please call us at{" "}
          <a href="tel:+15874323639" className="text-accent font-semibold">(587) 432-3639</a>{" "}
          to schedule directly.
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const handleChipClick = (slot: Slot, memberId: string) => {
    const key = `${slot.start}-${memberId}`;
    if (selected?.slotIdx === key) {
      // Already selected — confirm
      onSelect(slot, memberId);
    } else {
      setSelected({ slotIdx: key, memberId });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-sm text-muted-foreground">
          {slots.length} time{slots.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {dayGroups.map((group) => {
        const isExpanded = expandedDay === group.dateKey;
        return (
          <div
            key={group.dateKey}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedDay(isExpanded ? null : group.dateKey)}
              className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{group.label}</span>
                {group.hasClustered && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    We'll be in your area!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {group.slots.length} slot{group.slots.length !== 1 ? "s" : ""}
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {group.slots.map((slot) => {
                    const timeStr = new Date(slot.start).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: timezone,
                    });

                    // Show a chip for each available member
                    return slot.available_members.map((member) => {
                      const key = `${slot.start}-${member.id}`;
                      return (
                        <TimeChip
                          key={key}
                          time={timeStr}
                          memberName={member.name}
                          clustered={slot.clustered}
                          selected={selected?.slotIdx === key}
                          onClick={() => handleChipClick(slot, member.id)}
                        />
                      );
                    });
                  })}
                </div>
                {selected && group.slots.some((s) =>
                  s.available_members.some((m) => `${s.start}-${m.id}` === selected.slotIdx)
                ) && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="cta"
                      size="lg"
                      onClick={() => {
                        const slot = group.slots.find((s) =>
                          s.available_members.some((m) => `${s.start}-${m.id}` === selected.slotIdx)
                        );
                        if (slot) onSelect(slot, selected.memberId);
                      }}
                    >
                      SELECT THIS TIME
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
