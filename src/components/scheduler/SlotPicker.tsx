import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Slot } from "@/hooks/use-scheduler";

interface SlotPickerProps {
  slots: Slot[];
  loading: boolean;
  timezone: string;
  viewMonth: { year: number; month: number };
  onViewMonthChange: (m: { year: number; month: number }) => void;
  onSelect: (slot: Slot, memberId: string) => void;
  onBack: () => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SlotPicker({
  slots,
  loading,
  timezone,
  viewMonth,
  onViewMonthChange,
  onSelect,
  onBack,
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group slots by date (YYYY-MM-DD)
  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const dateKey = new Date(slot.start).toLocaleDateString("en-CA", { timeZone: timezone });
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(slot);
    }
    return map;
  }, [slots, timezone]);

  // Build the calendar grid for the current view month
  const calendarDays = useMemo(() => {
    const { year, month } = viewMonth;
    const firstDay = new Date(year, month, 1);
    const startPad = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toLocaleDateString("en-CA", { timeZone: timezone });

    const days: { date: string; day: number; inMonth: boolean; hasSlots: boolean; isPast: boolean }[] = [];

    for (let i = 0; i < startPad; i++) {
      days.push({ date: "", day: 0, inMonth: false, hasSlots: false, isPast: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const slotsForDay = slotsByDate.get(dateStr) || [];
      days.push({
        date: dateStr,
        day: d,
        inMonth: true,
        hasSlots: slotsForDay.length > 0,
        isPast: dateStr < today,
      });
    }

    return days;
  }, [viewMonth, slotsByDate, timezone]);

  const monthLabel = new Date(viewMonth.year, viewMonth.month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPrevMonth = () => {
    const m = viewMonth.month - 1;
    onViewMonthChange(m < 0 ? { year: viewMonth.year - 1, month: 11 } : { year: viewMonth.year, month: m });
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    const m = viewMonth.month + 1;
    onViewMonthChange(m > 11 ? { year: viewMonth.year + 1, month: 0 } : { year: viewMonth.year, month: m });
    setSelectedDate(null);
  };

  // Time slots for the selected date
  const selectedDateSlots = selectedDate ? (slotsByDate.get(selectedDate) || []) : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-muted-foreground">Finding available times...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground font-medium mb-2">No available slots this month</p>
        <p className="text-muted-foreground mb-6">
          Try another month, or call us at{" "}
          <a href="tel:+15874323639" className="text-accent font-semibold">(587) 432-3639</a>.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
          <Button variant="outline" onClick={goToNextMonth}>
            Next Month <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-sm text-muted-foreground">
          {selectedDate ? "Pick a time below" : "Pick a day"}
        </p>
      </div>

      {/* Calendar Month View */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Month header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/50">
          <button type="button" onClick={goToPrevMonth} className="p-1 hover:bg-secondary rounded-md transition-colors">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <span className="font-semibold text-foreground">{monthLabel}</span>
          <button type="button" onClick={goToNextMonth} className="p-1 hover:bg-secondary rounded-md transition-colors">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (!day.inMonth) {
              return <div key={i} className="aspect-square border-b border-r border-border/30" />;
            }

            const isSelected = day.date === selectedDate;
            const isAvailable = day.hasSlots && !day.isPast;

            return (
              <button
                key={day.date}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedDate(isSelected ? null : day.date)}
                className={`aspect-square flex flex-col items-center justify-center border-b border-r border-border/30 transition-all relative ${
                  isSelected
                    ? "bg-accent text-accent-foreground font-bold"
                    : isAvailable
                    ? "hover:bg-accent/10 cursor-pointer"
                    : "text-muted-foreground/40 cursor-default"
                }`}
              >
                <span className={`text-sm ${isAvailable && !isSelected ? "text-foreground font-medium" : ""}`}>
                  {day.day}
                </span>
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots for Selected Date */}
      {selectedDate && selectedDateSlots.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedDateSlots.map((slot) => {
              const timeStr = new Date(slot.start).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: timezone,
              });
              const memberId = slot.available_members[0]?.id;

              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => onSelect(slot, memberId)}
                  className={`px-5 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                    slot.clustered
                      ? "border-green-300 bg-green-50/50 hover:border-green-500 hover:bg-green-50 text-foreground"
                      : "border-border bg-card hover:border-accent/50 hover:shadow-sm text-foreground"
                  }`}
                >
                  {timeStr}
                  {slot.clustered && (
                    <span className="block text-[10px] font-medium text-green-600 mt-0.5">
                      We'll be nearby!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
