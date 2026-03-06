import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsResponse, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { queryFreeBusy } from "../_shared/google-calendar.ts";
import { getZone, isSameFSA, isSameZone } from "../_shared/calgary-zones.ts";

interface SlotRequest {
  postal_code?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
}

interface Slot {
  start: string;          // ISO timestamp
  end: string;            // ISO timestamp
  available_members: { id: string; name: string }[];
  clustered: boolean;     // "We'll be in your area!"
  cluster_score: number;  // Higher = better clustering
}

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body: SlotRequest = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load config
    const { data: configRows } = await supabase
      .from("scheduler_config")
      .select("key, value");

    const cfg: Record<string, unknown> = {};
    for (const row of configRows || []) cfg[row.key] = row.value;

    const timezone = (cfg.timezone as string) || "America/Edmonton";
    const businessHours = cfg.business_hours as { start?: string; end?: string; weekday?: { start: string; end: string } } || {};
    const dayStart = businessHours.start || businessHours.weekday?.start || "08:00";
    const dayEnd = businessHours.end || businessHours.weekday?.end || "18:00";
    const slotDuration = Number(cfg.slot_duration_minutes) || 120;
    const windowDays = Number(cfg.booking_window_days) || 14;
    const minLeadHours = Number(cfg.min_lead_hours) || 4;
    const travelBuffer = Number(cfg.travel_buffer_minutes) || 30;
    const rushTravelBuffer = Number(cfg.rush_travel_buffer_minutes) || 60;
    const rushHours = (cfg.rush_hours as { start: string; end: string }[]) || [];
    const lowPriorityZones = (cfg.low_priority_zones as string[]) || [];

    // Load team members
    const { data: members } = await supabase
      .from("team_members")
      .select("id, name, email, google_calendar_id, is_primary")
      .eq("is_active", true);

    if (!members?.length) {
      return jsonResponse({ slots: [], message: "No team members available" });
    }

    // Determine date range
    // We work with date strings (YYYY-MM-DD) and build Mountain Time timestamps
    const now = new Date();
    const minStart = new Date(now.getTime() + minLeadHours * 60 * 60 * 1000);

    const todayStr = now.toLocaleDateString("en-CA", { timeZone: timezone });
    const dateFromStr = body.date_from || todayStr;
    const dateToStr = body.date_to || (() => {
      const d = new Date(dateFromStr + "T12:00:00Z");
      d.setDate(d.getDate() + windowDays);
      return d.toISOString().split("T")[0];
    })();

    // For Google Calendar FreeBusy, we need rough UTC bounds (generous range)
    const timeMin = new Date(dateFromStr + "T00:00:00Z").toISOString();
    const timeMax = new Date(dateToStr + "T23:59:59Z").toISOString();

    // Query Google Calendar FreeBusy for all team members
    // Use the first member's email to impersonate for the FreeBusy query
    const calendarIds = members.map((m) => m.google_calendar_id);
    let freeBusyData;
    try {
      freeBusyData = await queryFreeBusy(calendarIds, timeMin, timeMax, members[0].email);
    } catch (err) {
      console.error("[scheduler-slots] FreeBusy error:", err);
      // Fall back to DB-only availability if Google Calendar is not configured
      freeBusyData = { calendars: {} };
    }

    // Load existing confirmed bookings from DB
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("assigned_to, slot_start, slot_end, postal_code")
      .eq("status", "confirmed")
      .gte("slot_start", timeMin)
      .lte("slot_end", timeMax);

    const requestZone = getZone(body.postal_code);

    // Generate slots
    const slots: Slot[] = [];

    // Helper: convert "YYYY-MM-DD HH:MM" in Mountain Time to a UTC Date
    // We use Intl to figure out the UTC offset for the given date in the timezone
    function mountainToUTC(dateStr: string, timeStr: string): Date {
      // Create a date in the target timezone by parsing components
      const [hours, minutes] = timeStr.split(":").map(Number);
      // Use a reference point to determine UTC offset
      const ref = new Date(`${dateStr}T12:00:00Z`);
      const utcStr = ref.toLocaleString("en-US", { timeZone: "UTC" });
      const tzStr = ref.toLocaleString("en-US", { timeZone: timezone });
      const utcRef = new Date(utcStr);
      const tzRef = new Date(tzStr);
      const offsetMs = utcRef.getTime() - tzRef.getTime();
      // Build the local time and apply offset to get UTC
      const local = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`);
      return new Date(local.getTime() + offsetMs);
    }

    // Iterate over each day (7 days a week)
    const currentDateObj = new Date(dateFromStr + "T12:00:00Z");
    const endDateObj = new Date(dateToStr + "T12:00:00Z");
    while (currentDateObj <= endDateObj) {
      const dateStr = currentDateObj.toISOString().split("T")[0];

      // Generate candidate slot times in Mountain Time
      const slotDayStartUTC = mountainToUTC(dateStr, dayStart);
      const slotDayEndUTC = mountainToUTC(dateStr, dayEnd);

      let slotStart = new Date(slotDayStartUTC);
      while (slotStart < slotDayEndUTC) {
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
        if (slotEnd > slotDayEndUTC) break;

        // Skip slots that are too soon
        if (slotStart < minStart) {
          slotStart = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
          continue;
        }

        // Check which team members are available for this slot
        const availableMembers: { id: string; name: string }[] = [];

        for (const member of members) {
          const calId = member.google_calendar_id;
          const busySlots = freeBusyData.calendars?.[calId]?.busy || [];

          // Check Google Calendar busy times (with travel buffer)
          const buffer = isRushHour(slotStart, rushHours) ? rushTravelBuffer : travelBuffer;
          const bufferedStart = new Date(slotStart.getTime() - buffer * 60 * 1000);
          const bufferedEnd = new Date(slotEnd.getTime() + buffer * 60 * 1000);

          const gcalBusy = busySlots.some((b) => {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            return bufferedStart < bEnd && bufferedEnd > bStart;
          });

          if (gcalBusy) continue;

          // Check existing bookings in DB
          const dbBusy = (existingBookings || []).some((b) => {
            if (b.assigned_to !== member.id) return false;
            const bStart = new Date(b.slot_start);
            const bEnd = new Date(b.slot_end);
            return bufferedStart < bEnd && bufferedEnd > bStart;
          });

          if (dbBusy) continue;

          availableMembers.push({ id: member.id, name: member.name });
        }

        if (availableMembers.length > 0) {
          // Calculate clustering score
          let clusterScore = 0;
          let clustered = false;

          if (body.postal_code) {
            const nearbyBookings = (existingBookings || []).filter((b) => {
              const bStart = new Date(b.slot_start);
              return bStart.toISOString().split("T")[0] === dateStr;
            });

            for (const b of nearbyBookings) {
              if (isSameFSA(body.postal_code, b.postal_code)) {
                clusterScore += 10;
                clustered = true;
              } else if (isSameZone(body.postal_code, b.postal_code)) {
                clusterScore += 5;
                clustered = true;
              }
            }
          }

          // Penalize low-priority zones
          if (requestZone && lowPriorityZones.includes(requestZone)) {
            clusterScore -= 3;
          }

          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            available_members: availableMembers,
            clustered,
            cluster_score: clusterScore,
          });
        }

        slotStart = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
      }

      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    // Sort chronologically — clustering info is kept on slots for frontend use
    slots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return jsonResponse({
      slots,
      timezone,
      postal_code_zone: requestZone,
    });
  } catch (err) {
    console.error("[scheduler-slots]", err);
    return errorResponse(err.message);
  }
});

function isRushHour(time: Date, rushHours: { start: string; end: string }[]): boolean {
  const hhmm = time.toTimeString().substring(0, 5);
  return rushHours.some((r) => hhmm >= r.start && hhmm <= r.end);
}
