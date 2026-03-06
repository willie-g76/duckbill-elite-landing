import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Missing id parameter", { status: 400 });
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

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lead.last_name || ""};${lead.first_name};;;`,
      `FN:${lead.first_name} ${lead.last_name || ""}`.trim(),
      `TEL;TYPE=CELL:+1${phone}`,
      lead.email ? `EMAIL:${lead.email}` : "",
      lead.address ? `ADR;TYPE=HOME:;;${lead.address};${lead.city || "Calgary"};;AB;CA` : "",
      `NOTE:Duckbill Roofing lead`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const filename = `${lead.first_name}_${lead.last_name || "Lead"}.vcf`.replace(/\s+/g, "_");

    return new Response(vcard, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
});
