import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsResponse, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { deleteCalendarEvent } from "../_shared/google-calendar.ts";

interface CancelRequest {
  booking_id: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body: CancelRequest = await req.json();

    if (!body.booking_id) {
      return errorResponse("booking_id is required", 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get booking with team member info
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*, team_members(name, email, google_calendar_id)")
      .eq("id", body.booking_id)
      .single();

    if (fetchErr || !booking) {
      return errorResponse("Booking not found", 404);
    }

    if (booking.status === "cancelled") {
      return errorResponse("Booking is already cancelled", 400);
    }

    // Delete Google Calendar event
    if (booking.google_event_id && booking.team_members?.google_calendar_id) {
      try {
        await deleteCalendarEvent(
          booking.team_members.google_calendar_id,
          booking.google_event_id
        );
      } catch (err) {
        console.error("[scheduler-cancel] Failed to delete calendar event:", err);
      }
    }

    // Update booking status
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancel_reason: body.reason || null,
      })
      .eq("id", body.booking_id);

    if (updateErr) throw updateErr;

    // Notify team via email
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const slotStart = new Date(booking.slot_start);
      const fullName = `${booking.first_name} ${booking.last_name || ""}`.trim();

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Duckbill Leads <leads@duckbillroofing.ca>",
            to: ["info@duckbillroofing.ca"],
            subject: `Booking Cancelled: ${fullName} — ${slotStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Edmonton" })}`,
            html: `<p><strong>${fullName}</strong> cancelled their booking for <strong>${slotStart.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Edmonton" })}</strong> at <strong>${slotStart.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Edmonton" })}</strong>.</p>${body.reason ? `<p>Reason: ${body.reason}</p>` : ""}<p style="color:#94a3b8;font-size:12px;margin-top:16px;">Duckbill Elite Roofing — Smart Scheduler</p>`,
          }),
        });
      } catch (err) {
        console.error("[scheduler-cancel] Team notification failed:", err);
      }
    }

    return jsonResponse({ success: true, booking_id: body.booking_id });
  } catch (err) {
    console.error("[scheduler-cancel]", err);
    return errorResponse(err.message);
  }
});
