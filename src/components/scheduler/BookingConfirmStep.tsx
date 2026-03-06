import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContactInfo, Slot } from "@/hooks/use-scheduler";

interface BookingConfirmStepProps {
  contact: ContactInfo;
  slot: Slot;
  memberName: string;
  timezone: string;
  loading: boolean;
  error: Error | null;
  onConfirm: () => void;
  onBack: () => void;
}

export default function BookingConfirmStep({
  contact,
  slot,
  memberName,
  timezone,
  loading,
  error,
  onConfirm,
  onBack,
}: BookingConfirmStepProps) {
  const slotStart = new Date(slot.start);
  const dateStr = slotStart.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  });
  const timeStr = slotStart.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  });
  const endTimeStr = new Date(slot.end).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  });

  const isSlotTaken = error?.message === "SLOT_TAKEN";

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Change time
      </button>

      <div className="bg-secondary rounded-xl p-6 space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground">Booking Summary</h3>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <span className="font-medium text-muted-foreground">Name</span>
          <span className="text-foreground">{contact.firstName} {contact.lastName}</span>

          <span className="font-medium text-muted-foreground">Phone</span>
          <span className="text-foreground">{contact.phone}</span>

          {contact.email && (
            <>
              <span className="font-medium text-muted-foreground">Email</span>
              <span className="text-foreground">{contact.email}</span>
            </>
          )}

          <span className="font-medium text-muted-foreground">Address</span>
          <span className="text-foreground">{contact.address}</span>

          <div className="col-span-2 border-t border-border my-1" />

          <span className="font-medium text-muted-foreground">Date</span>
          <span className="text-foreground font-semibold">{dateStr}</span>

          <span className="font-medium text-muted-foreground">Time</span>
          <span className="text-foreground font-semibold">{timeStr} — {endTimeStr}</span>

          <span className="font-medium text-muted-foreground">Estimator</span>
          <span className="text-foreground">{memberName}</span>
        </div>
      </div>

      {isSlotTaken && (
        <div className="flex items-start gap-3 bg-destructive/10 text-destructive rounded-lg p-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">This time slot was just taken</p>
            <p className="text-sm mt-1">Please go back and pick another time.</p>
          </div>
        </div>
      )}

      {error && !isSlotTaken && (
        <div className="flex items-start gap-3 bg-destructive/10 text-destructive rounded-lg p-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      <Button
        variant="cta"
        size="xl"
        className="w-full"
        onClick={onConfirm}
        disabled={loading || isSlotTaken}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Confirming...
          </>
        ) : (
          "CONFIRM BOOKING"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By confirming, you agree to receive a confirmation email and calendar invite.
      </p>
    </div>
  );
}
