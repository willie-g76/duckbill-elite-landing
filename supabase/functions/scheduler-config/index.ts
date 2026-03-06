import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsResponse, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: configRows, error } = await supabase
      .from("scheduler_config")
      .select("key, value");

    if (error) throw error;

    // Convert rows to a flat config object
    const config: Record<string, unknown> = {};
    for (const row of configRows || []) {
      config[row.key] = row.value;
    }

    // Also return active team members (names only, for frontend display)
    const { data: members } = await supabase
      .from("team_members")
      .select("id, name, is_primary")
      .eq("is_active", true)
      .order("is_primary", { ascending: false });

    return jsonResponse({ config, team_members: members || [] });
  } catch (err) {
    console.error("[scheduler-config]", err);
    return errorResponse(err.message);
  }
});
