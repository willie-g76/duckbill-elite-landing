import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ANON_KEY}`,
  apikey: ANON_KEY,
};

export interface TeamMember {
  id: string;
  name: string;
  is_primary: boolean;
}

export interface SchedulerConfig {
  config: Record<string, unknown>;
  team_members: TeamMember[];
}

export interface Slot {
  start: string;
  end: string;
  available_members: { id: string; name: string }[];
  clustered: boolean;
  cluster_score: number;
}

export interface SlotsResponse {
  slots: Slot[];
  timezone: string;
  postal_code_zone: string | null;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

export interface BookingResult {
  booking_id: string;
  google_event_id: string | null;
  calendar_link: string | null;
  assigned_to: string;
  slot_start: string;
  slot_end: string;
}

export type BookingStep = 1 | 2 | 3 | 4;

/** Get YYYY-MM-DD for the first and last day of a month */
function getMonthRange(year: number, month: number) {
  const dateFrom = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const dateTo = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { dateFrom, dateTo };
}

export function useScheduler() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<BookingStep>(1);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // The month the calendar is currently viewing
  const now = new Date();
  const [viewMonth, setViewMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });

  // Scroll to top of booking card when step changes
  useEffect(() => {
    if (stepRef.current) {
      const top = stepRef.current.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for fixed header
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [step]);

  // Fetch scheduler config
  const configQuery = useQuery<SchedulerConfig>({
    queryKey: ["scheduler-config"],
    queryFn: async () => {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/scheduler-config`, { headers });
      if (!res.ok) throw new Error("Failed to load scheduler config");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch available slots for the currently viewed month
  const { dateFrom, dateTo } = getMonthRange(viewMonth.year, viewMonth.month);

  const slotsQuery = useQuery<SlotsResponse>({
    queryKey: ["scheduler-slots", contact?.postalCode, dateFrom, dateTo],
    queryFn: async () => {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/scheduler-slots`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          postal_code: contact?.postalCode,
          date_from: dateFrom,
          date_to: dateTo,
        }),
      });
      if (!res.ok) throw new Error("Failed to load available slots");
      return res.json();
    },
    enabled: !!contact,
    staleTime: 60 * 1000,
  });

  // Book appointment
  const bookMutation = useMutation<BookingResult, Error>({
    mutationFn: async () => {
      if (!contact || !selectedSlot || !selectedMemberId) {
        throw new Error("Missing booking data");
      }
      const res = await fetch(`${SUPABASE_URL}/functions/v1/scheduler-book`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          postal_code: contact.postalCode,
          slot_start: selectedSlot.start,
          slot_end: selectedSlot.end,
          assigned_to_id: selectedMemberId,
        }),
      });
      if (res.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["scheduler-slots"] });
        throw new Error("SLOT_TAKEN");
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Booking failed" }));
        throw new Error(err.error || "Booking failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setBookingResult(data);
      setStep(4);
    },
  });

  function submitContact(info: ContactInfo) {
    setContact(info);
    setStep(2);
  }

  function selectSlot(slot: Slot, memberId: string) {
    setSelectedSlot(slot);
    setSelectedMemberId(memberId);
    setStep(3);
  }

  function confirmBooking() {
    bookMutation.mutate();
  }

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) {
      setSelectedSlot(null);
      setSelectedMemberId(null);
      setStep(2);
    }
  }

  function reset() {
    setStep(1);
    setContact(null);
    setSelectedSlot(null);
    setSelectedMemberId(null);
    setBookingResult(null);
    bookMutation.reset();
  }

  return {
    step,
    stepRef,
    contact,
    selectedSlot,
    selectedMemberId,
    bookingResult,
    config: configQuery.data,
    configLoading: configQuery.isLoading,
    slots: slotsQuery.data?.slots || [],
    slotsLoading: slotsQuery.isLoading,
    slotsTimezone: slotsQuery.data?.timezone || "America/Edmonton",
    postalCodeZone: slotsQuery.data?.postal_code_zone,
    bookingLoading: bookMutation.isPending,
    bookingError: bookMutation.error,
    viewMonth,
    setViewMonth,
    submitContact,
    selectSlot,
    confirmBooking,
    goBack,
    reset,
  };
}
