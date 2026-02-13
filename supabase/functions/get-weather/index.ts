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

    const url = `https://api.openweathermap.org/data/2.5/weather?q=Calgary,CA&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error [${response.status}]: ${await response.text()}`);
    }

    const data = await response.json();

    const result = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather[0]?.description || "",
      icon: data.weather[0]?.icon || "01d",
      wind_speed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      rain: data.rain?.["1h"] || 0,
      snow: data.snow?.["1h"] || 0,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
