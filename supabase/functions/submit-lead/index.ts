import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createContact,
  createOpportunity,
  communityTag,
} from "../_shared/gohighlevel.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// GHL Pipeline & Stage IDs for "Door Hanger Leads"
const GHL_PIPELINE_ID = "LynLSspbVZ5Kyr4o6ctx";
const GHL_STAGE_NEW_LEAD = "e708602f-903b-4cb4-ae34-f096fb6ea088";

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

function buildEmailHtml(lead: LeadPayload): string {
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

      <div style="margin-top:24px;text-align:center;">
        <a href="tel:${lead.phone.replace(/[^+\d]/g, "")}" style="display:inline-block;background:#f5a623;color:#1a1a2e;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
          Call ${lead.firstName || "Customer"}
        </a>
      </div>
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

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
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

    const leadId = crypto.randomUUID();

    // Build a plain-text subject line
    const subjectParts = [`New Lead: ${lead.firstName} ${lead.lastName}`.trim()];
    if (lead.community) subjectParts.push(`(${lead.community})`);
    if (lead.serviceType) subjectParts.push(`- ${lead.serviceType}`);

    // Send email via Resend
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
        html: buildEmailHtml(lead),
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend API error:", errText);
      console.error(`[submit-lead] Resend failed for lead ${leadId}: ${errText}`);
    }

    // ── Push lead into GoHighLevel ──
    let ghlContactId: string | null = null;
    try {
      const tags = ["door hanger campaign"];
      if (lead.community) {
        tags.push(communityTag(lead.community));
      }
      if (lead.source === "qr-landing") {
        tags.push("qr-scan");
      }

      const ghlContact = await createContact({
        firstName: lead.firstName,
        lastName: lead.lastName || undefined,
        email: lead.email || undefined,
        phone: lead.phone,
        address1: lead.address || undefined,
        city: lead.city || undefined,
        state: "Alberta",
        country: "CA",
        source: lead.source === "qr-landing" ? "QR Code" : "Website",
        tags,
      });

      ghlContactId = ghlContact.id;

      // Create opportunity in the Door Hanger Leads pipeline
      await createOpportunity({
        pipelineId: GHL_PIPELINE_ID,
        pipelineStageId: GHL_STAGE_NEW_LEAD,
        contactId: ghlContact.id,
        name: `${lead.firstName} ${lead.lastName || ""} — ${lead.community || "Website"}`.trim(),
        status: "open",
        source: lead.source === "qr-landing" ? "QR Code" : "Website",
      });

      console.log(`[submit-lead] GHL contact created: ${ghlContact.id}`);
    } catch (ghlErr) {
      // Log but don't fail the request — email notification still went out
      console.error("[submit-lead] GHL integration error:", ghlErr);
    }

    return new Response(
      JSON.stringify({ success: true, id: leadId, ghlContactId }),
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
