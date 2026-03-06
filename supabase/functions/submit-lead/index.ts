import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  serviceType: string;
  urgency?: string;
  preferredDate?: string;
  preferredTime?: string;
  details?: string;
  source: "estimate" | "qr-landing";
  community?: string;
}

function buildEmailHtml(lead: LeadPayload, leadId: string, supabaseUrl: string): string {
  const phone = lead.phone.replace(/[^\d]/g, "").replace(/^1/, "");
  const sourceLabel = lead.source === "qr-landing"
    ? `QR Code Landing Page${lead.community ? ` (${lead.community})` : ""}`
    : "Estimate Page";

  const urgencyLabels: Record<string, string> = {
    emergency: "Emergency (ASAP)",
    week: "Within a Week",
    month: "Within a Month",
    planning: "Just Planning",
  };

  const serviceLabels: Record<string, string> = {
    residential: "Residential Roofing",
    waterproofing: "Flat Roof Waterproofing",
    repair: "Roof Repair",
    inspection: "Roof Inspection",
    other: "Other",
  };

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: `${lead.firstName} ${lead.lastName}`.trim() },
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "Address", value: lead.address },
    { label: "City / Community", value: lead.city },
    { label: "Service Type", value: serviceLabels[lead.serviceType] || lead.serviceType },
  ];

  if (lead.urgency) {
    rows.push({ label: "Urgency", value: urgencyLabels[lead.urgency] || lead.urgency });
  }
  if (lead.preferredDate) {
    rows.push({ label: "Preferred Date", value: lead.preferredDate });
  }
  if (lead.preferredTime) {
    rows.push({ label: "Preferred Time", value: lead.preferredTime });
  }
  if (lead.details) {
    rows.push({ label: "Details", value: lead.details });
  }

  const tableRows = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 14px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;white-space:nowrap;vertical-align:top;">${r.label}</td>
        <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #e2e8f0;">${r.value}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="margin:0;color:#f5a623;font-size:22px;font-weight:700;">New Lead Received</h1>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:14px;">via ${sourceLabel}</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <table style="width:100%;border-collapse:collapse;">
        ${tableRows}
      </table>

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
        +1 ${lead.phone}
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
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${lead.firstName || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;width:110px;">Last Name</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${lead.lastName || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Address</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${lead.address || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Phone</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${lead.phone || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Email</td>
          <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:500;">${lead.email || "—"}</td>
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
          <td style="padding:8px 0;color:#dc2626;font-size:15px;font-weight:600;font-style:italic;">Needs input &#8594;</td>
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
      Duckbill Elite Roofing &mdash; Lead Notification System
    </p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lead: LeadPayload = await req.json();

    // Basic validation
    if (!lead.firstName || !lead.phone) {
      return new Response(
        JSON.stringify({ error: "firstName and phone are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── 1. Save lead to database (never lose a submission) ──
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let emailSent = false;

    const { data: dbLead, error: dbError } = await supabase
      .from("leads")
      .insert({
        first_name: lead.firstName,
        last_name: lead.lastName || null,
        email: lead.email || null,
        phone: lead.phone,
        address: lead.address || null,
        city: lead.city || null,
        service_type: lead.serviceType || null,
        urgency: lead.urgency || null,
        preferred_date: lead.preferredDate || null,
        preferred_time: lead.preferredTime || null,
        details: lead.details || null,
        source: lead.source,
        community: lead.community || null,
        email_sent: false,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[submit-lead] DB insert failed:", dbError);
    }

    const leadId = dbLead?.id || crypto.randomUUID();

    // ── 2. Send email notification via Resend ──
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const subjectParts = [`New Lead: ${lead.firstName} ${lead.lastName}`.trim()];
      if (lead.community) subjectParts.push(`(${lead.community})`);
      if (lead.serviceType) subjectParts.push(`- ${lead.serviceType}`);

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Duckbill Leads <leads@duckbillroofing.ca>",
          to: ["info@duckbillroofing.ca"],
          subject: subjectParts.join(" "),
          html: buildEmailHtml(lead, leadId, supabaseUrl),
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error(`[submit-lead] Resend failed for lead ${leadId}: ${errText}`);
      } else {
        emailSent = true;
      }

      // Update email_sent status in DB
      if (emailSent && dbLead?.id) {
        await supabase
          .from("leads")
          .update({ email_sent: true })
          .eq("id", dbLead.id);
      }
    } else {
      console.error("[submit-lead] RESEND_API_KEY not configured — lead saved to DB only");
    }

    return new Response(
      JSON.stringify({ success: true, id: leadId }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("submit-lead error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
