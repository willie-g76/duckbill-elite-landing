import { motion } from "framer-motion";
import { Check } from "lucide-react";
import CalendarLinks from "./CalendarLinks";
import type { BookingResult } from "@/hooks/use-scheduler";

interface BookingSuccessProps {
  result: BookingResult;
  address?: string;
  timezone: string;
}

export default function BookingSuccess({ result, address, timezone }: BookingSuccessProps) {
  const slotStart = new Date(result.slot_start);
  const slotEnd = new Date(result.slot_end);
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

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto"
      >
        <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
          You're All Set!
        </h2>
        <p className="text-muted-foreground text-lg">
          We'll see you on <span className="text-foreground font-semibold">{dateStr}</span> at{" "}
          <span className="text-foreground font-semibold">{timeStr}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary rounded-xl p-6 text-left space-y-3"
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <span className="font-medium text-muted-foreground">Estimator</span>
          <span className="text-foreground">{result.assigned_to}</span>

          <span className="font-medium text-muted-foreground">Date</span>
          <span className="text-foreground">{dateStr}</span>

          <span className="font-medium text-muted-foreground">Time</span>
          <span className="text-foreground">{timeStr}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm text-muted-foreground mb-3">Add to your calendar:</p>
        <CalendarLinks
          title="Roof Quote \u2014 Duckbill Roofing"
          start={result.slot_start}
          end={result.slot_end}
          location={address}
          description={`Roofing estimate with ${result.assigned_to} from Duckbill Roofing.\nPhone: (587) 432-3639`}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-sm text-muted-foreground"
      >
        Need to cancel? Call us at{" "}
        <a href="tel:+15874323639" className="text-accent font-semibold">(587) 432-3639</a>
      </motion.p>
    </div>
  );
}
