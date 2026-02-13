import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("Google_Maps_API_Key");
    if (!apiKey) {
      throw new Error("Google_Maps_API_Key is not configured");
    }

    const url = new URL(req.url);
    const community = url.searchParams.get("community") || "Calgary, AB";

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(community)}&zoom=13&size=600x300&scale=2&maptype=roadmap&markers=color:orange%7C${encodeURIComponent(community)}&key=${apiKey}`;

    const mapResponse = await fetch(mapUrl);
    if (!mapResponse.ok) {
      throw new Error(`Google Maps API error [${mapResponse.status}]`);
    }

    const imageBuffer = await mapResponse.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Map fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
