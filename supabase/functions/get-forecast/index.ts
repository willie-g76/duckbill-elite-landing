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
    const apiKey = Deno.env.get("OPENWEATHER_API_Key");
    if (!apiKey) {
      throw new Error("OPENWEATHER_API_Key is not configured");
    }

    const reqUrl = new URL(req.url);
    const lat = reqUrl.searchParams.get("lat");
    const lon = reqUrl.searchParams.get("lon");

    const locationQuery = lat && lon
      ? `lat=${lat}&lon=${lon}`
      : "q=Calgary,CA";

    const url = `https://api.openweathermap.org/data/2.5/forecast?${locationQuery}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error [${response.status}]: ${await response.text()}`);
    }

    const data = await response.json();

    // Group 3-hour intervals by date, skipping today (partial data)
    const today = new Date().toISOString().slice(0, 10);
    const dayMap: Record<string, { temps: number[]; icons: string[]; descriptions: string[] }> = {};

    for (const item of data.list) {
      const date = item.dt_txt.slice(0, 10);
      if (date === today) continue;

      if (!dayMap[date]) {
        dayMap[date] = { temps: [], icons: [], descriptions: [] };
      }
      dayMap[date].temps.push(item.main.temp);
      dayMap[date].icons.push(item.weather[0]?.icon || "01d");
      dayMap[date].descriptions.push(item.weather[0]?.description || "");
    }

    // Pick most-common value from an array
    const mostCommon = (arr: string[]): string => {
      const counts: Record<string, number> = {};
      for (const v of arr) counts[v] = (counts[v] || 0) + 1;
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    const forecast = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 5)
      .map(([date, d]) => {
        const dt = new Date(date + "T12:00:00");
        return {
          day: dt.toLocaleDateString("en-US", { weekday: "short" }),
          date,
          icon: mostCommon(d.icons),
          description: mostCommon(d.descriptions),
          high: Math.round(Math.max(...d.temps)),
          low: Math.round(Math.min(...d.temps)),
        };
      });

    return new Response(JSON.stringify({ forecast }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    console.error("Forecast fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
