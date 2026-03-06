import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action"); // call, text, vcard

  if (!id || !action) {
    return new Response("Missing id or action", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: lead, error } = await supabase
    .from("leads")
    .select("first_name, last_name, phone, email, address, city")
    .eq("id", id)
    .single();

  if (error || !lead) {
    return new Response("Lead not found", { status: 404 });
  }

  const phone = lead.phone.replace(/[^\d]/g, "").replace(/^1/, "");
  const fullPhone = `+1${phone}`;
  const name = `${lead.first_name} ${lead.last_name || ""}`.trim();

  // vCard download
  if (action === "vcard") {
    const qualifyUrl = `https://duckbillroofing.ca/qualify/${id}`;
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lead.last_name || ""};${lead.first_name};;;`,
      `FN:${name}`,
      `ORG:Duckbill Lead`,
      `TEL;TYPE=CELL:${fullPhone}`,
      lead.email ? `EMAIL:${lead.email}` : "",
      lead.address ? `ADR;TYPE=HOME:;;${lead.address};${lead.city || "Calgary"};;AB;CA` : "",
      `URL:${qualifyUrl}`,
      `NOTE:Duckbill Roofing lead\\nQualify: ${qualifyUrl}`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const filename = `${lead.first_name}_${lead.last_name || "Lead"}.vcf`.replace(/\s+/g, "_");
    return new Response(vcard, {
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // Call or Text — 302 redirect to tel:/sms: protocol
  const protocol = action === "text" ? "sms" : "tel";

  return new Response(null, {
    status: 302,
    headers: {
      "Location": `${protocol}:${fullPhone}`,
    },
  });
});
