import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsResponse, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { createCalendarEvent } from "../_shared/google-calendar.ts";
import { generateICS } from "../_shared/ics-generator.ts";

interface BookingRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  address?: string;
  postal_code?: string;
  slot_start: string;
  slot_end: string;
  assigned_to_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body: BookingRequest = await req.json();

    if (!body.first_name || !body.phone || !body.slot_start || !body.slot_end || !body.assigned_to_id) {
      return errorResponse("Missing required fields: first_name, phone, slot_start, slot_end, assigned_to_id", 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    // Get team member info
    const { data: member, error: memberErr } = await supabase
      .from("team_members")
      .select("id, name, email, google_calendar_id")
      .eq("id", body.assigned_to_id)
      .single();

    if (memberErr || !member) {
      return errorResponse("Team member not found", 404);
    }

    // Race-condition guard: check slot is still available
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .eq("assigned_to", body.assigned_to_id)
      .eq("status", "confirmed")
      .lt("slot_start", body.slot_end)
      .gt("slot_end", body.slot_start);

    if (conflicts && conflicts.length > 0) {
      return errorResponse("This time slot is no longer available. Please select another.", 409);
    }

    // Insert into leads table first
    const fullName = `${body.first_name} ${body.last_name || ""}`.trim();
    const { data: lead } = await supabase
      .from("leads")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name || null,
        email: body.email || null,
        phone: body.phone,
        address: body.address || null,
        postal_code: body.postal_code || null,
        source: "booking",
        email_sent: false,
      })
      .select("id")
      .single();

    // Insert booking
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name || null,
        email: body.email || null,
        phone: body.phone,
        address: body.address || null,
        postal_code: body.postal_code || null,
        assigned_to: body.assigned_to_id,
        slot_start: body.slot_start,
        slot_end: body.slot_end,
        status: "confirmed",
        lead_id: lead?.id || null,
      })
      .select("id")
      .single();

    if (bookingErr) throw bookingErr;

    // Create Google Calendar event
    const slotStart = new Date(body.slot_start);
    const slotEnd = new Date(body.slot_end);
    let googleEventId: string | null = null;
    let calendarLink: string | null = null;

    try {
      const event = await createCalendarEvent(member.google_calendar_id, {
        summary: `Roof Quote — ${fullName}`,
        description: [
          `Phone: ${body.phone}`,
          body.email ? `Email: ${body.email}` : null,
          body.address ? `Address: ${body.address}` : null,
          `\nBooked via duckbillroofing.ca/book`,
        ].filter(Boolean).join("\n"),
        location: body.address || undefined,
        start: { dateTime: body.slot_start, timeZone: "America/Edmonton" },
        end: { dateTime: body.slot_end, timeZone: "America/Edmonton" },
      });

      googleEventId = event.id;
      calendarLink = event.htmlLink;

      // Update booking with Google event ID
      await supabase
        .from("bookings")
        .update({ google_event_id: event.id })
        .eq("id", booking!.id);
    } catch (err) {
      console.error("[scheduler-book] Google Calendar event creation failed:", err);
      // Booking is still saved — we just won't have a calendar event
    }

    // Send confirmation email to homeowner
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && body.email) {
      const dateFormatted = slotStart.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "America/Edmonton",
      });
      const timeFormatted = slotStart.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Edmonton",
      });

      // Generate Add to Calendar URLs
      const gcalUrl = buildGoogleCalendarUrl(
        `Roof Quote — Duckbill Roofing`,
        body.slot_start,
        body.slot_end,
        body.address || "",
        `Your roofing estimate with Duckbill Roofing.\nPhone: (587) 432-3639`
      );

      const icsContent = generateICS({
        uid: `booking-${booking!.id}@duckbillroofing.ca`,
        summary: "Roof Quote — Duckbill Roofing",
        description: `Your roofing estimate with Duckbill Roofing.\nPhone: (587) 432-3639`,
        location: body.address || undefined,
        dtstart: slotStart,
        dtend: slotEnd,
      });

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Duckbill Roofing <bookings@duckbillroofing.ca>",
            to: [body.email],
            subject: `Booking Confirmed — ${dateFormatted} at ${timeFormatted}`,
            html: buildConfirmationEmail(fullName, dateFormatted, timeFormatted, body.address, gcalUrl, booking!.id, supabaseUrl),
            attachments: [
              {
                filename: "roofing-appointment.ics",
                content: btoa(icsContent),
                content_type: "text/calendar",
              },
            ],
          }),
        });
      } catch (err) {
        console.error("[scheduler-book] Confirmation email failed:", err);
      }
    }

    // Send notification to team
    if (resendApiKey) {
      const dateFormatted = slotStart.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "America/Edmonton",
      });
      const timeFormatted = slotStart.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Edmonton",
      });

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
            subject: `New Booking: ${fullName} — ${slotStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Edmonton" })} at ${timeFormatted}`,
            html: buildTeamNotificationEmail(fullName, body.phone, body.email, body.address, dateFormatted, timeFormatted, member.name, booking!.id, lead?.id || booking!.id, supabaseUrl),
          }),
        });
      } catch (err) {
        console.error("[scheduler-book] Team notification failed:", err);
      }
    }

    return jsonResponse({
      booking_id: booking!.id,
      google_event_id: googleEventId,
      calendar_link: calendarLink,
      assigned_to: body.assigned_to_id,
      slot_start: body.slot_start,
      slot_end: body.slot_end,
    });
  } catch (err) {
    console.error("[scheduler-book]", err);
    return errorResponse(err.message);
  }
});

function buildGoogleCalendarUrl(
  title: string, start: string, end: string, location: string, details: string
): string {
  const fmt = (d: string) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildConfirmationEmail(
  name: string, date: string, time: string,
  address: string | undefined, gcalUrl: string, bookingId: string, supabaseUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="margin:0;color:#f5a623;font-size:22px;">&#9989; Booking Confirmed!</h1>
    </div>
    <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;">
      <p style="color:#334155;font-size:16px;margin:0 0 20px;">Hi ${name},</p>
      <p style="color:#475569;font-size:15px;margin:0 0 20px;">Your roofing estimate has been confirmed. Here are the details:</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Date</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${date}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Time</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${time}</td>
        </tr>
        ${address ? `<tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Address</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${address}</td>
        </tr>` : ""}
      </table>

      <table style="width:100%;border-collapse:separate;border-spacing:8px 0;">
        <tr>
          <td style="text-align:center;">
            <a href="${gcalUrl}" style="display:block;background:#f5a623;color:#1a1a2e;text-decoration:none;padding:14px;border-radius:8px;font-weight:600;font-size:14px;">
              Add to Google Calendar
            </a>
          </td>
        </tr>
      </table>
      <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:8px;">
        An .ics file is also attached — open it to add to Apple Calendar or Outlook.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
      <p style="color:#475569;font-size:14px;margin:0 0 4px;">Need to cancel or reschedule?</p>
      <p style="color:#475569;font-size:14px;margin:0;">Call us at <a href="tel:+15874323639" style="color:#f5a623;">(587) 432-3639</a></p>
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">Duckbill Elite Roofing — Calgary, AB</p>
  </div>
</body>
</html>`;
}

function buildTeamNotificationEmail(
  name: string, phone: string, email: string | undefined,
  address: string | undefined, date: string, time: string,
  assignee: string, bookingId: string, leadId: string, supabaseUrl: string
): string {
  const phoneDigits = phone.replace(/[^\d]/g, "").replace(/^1/, "");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="margin:0;color:#22c55e;font-size:22px;">&#128197; New Booking!</h1>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:14px;">via Online Scheduler</p>
    </div>

    <!-- Lead Details + Booking Info -->
    <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Customer</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Phone</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${phone}</td>
        </tr>
        ${email ? `<tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Email</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${email}</td>
        </tr>` : ""}
        ${address ? `<tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Address</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${address}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Date</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${date}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Time</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${time}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;">Assigned To</td>
          <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${assignee}</td>
        </tr>
      </table>

      <!-- Call / Text / Save Contact Buttons -->
      <table style="width:100%;margin-top:24px;border-collapse:separate;border-spacing:8px 0;">
        <tr>
          <td style="width:33%;text-align:center;">
            <a href="${supabaseUrl}/functions/v1/lead-action?id=${leadId}&action=call" style="display:block;background:#f5a623;color:#1a1a2e;text-decoration:none;padding:14px 8px;border-radius:8px;font-weight:600;font-size:14px;">
              &#9742; Call
            </a>
          </td>
          <td style="width:33%;text-align:center;">
            <a href="${supabaseUrl}/functions/v1/lead-action?id=${leadId}&action=text" style="display:block;background:#1a1a2e;color:#f5a623;text-decoration:none;padding:14px 8px;border-radius:8px;font-weight:600;font-size:14px;border:2px solid #f5a623;">
              &#9993; Text
            </a>
          </td>
          <td style="width:33%;text-align:center;">
            <a href="${supabaseUrl}/functions/v1/lead-action?id=${leadId}&action=vcard" style="display:block;background:#22c55e;color:#ffffff;text-decoration:none;padding:14px 8px;border-radius:8px;font-weight:600;font-size:14px;">
              &#43; Save Contact
            </a>
          </td>
        </tr>
      </table>
      <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:8px;">
        +1 ${phone}
      </p>
    </div>

    <!-- Qualification Card -->
    <div style="background:#ffffff;margin-top:12px;padding:24px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #f5a623;padding-bottom:8px;">
        &#9997; Qualification Details
      </h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;width:110px;">First Name</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${name.split(" ")[0] || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;width:110px;">Last Name</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${name.split(" ").slice(1).join(" ") || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Address</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${address || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Phone</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${phone || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Email</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${email || "—"}</td>
        </tr>
        <tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #e2e8f0;"></td></tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Project Type</td>
          <td style="padding:8px 0;color:#dc2626;font-size:15px;font-weight:600;font-style:italic;">Needs input &#8594;</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Roof Type</td>
          <td style="padding:8px 0;color:#dc2626;font-size:15px;font-weight:600;font-style:italic;">Needs input &#8594;</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Quote Date</td>
          <td style="padding:8px 0;color:#22c55e;font-size:15px;font-weight:600;">${date} at ${time}</td>
        </tr>
      </table>

      <table style="width:100%;margin-top:20px;border-collapse:collapse;">
        <tr>
          <td style="text-align:center;">
            <a href="https://duckbillroofing.ca/qualify/${leadId}" style="display:block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:16px;border-radius:10px;font-weight:700;font-size:16px;">
              Complete Qualification &#8594;
            </a>
          </td>
        </tr>
      </table>
      <p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:8px;">
        Opens a form to fill in missing details during the call
      </p>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">
      Duckbill Elite Roofing &mdash; Smart Scheduler
    </p>
  </div>
</body>
</html>`;
}
