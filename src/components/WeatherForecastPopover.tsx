import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Thermometer, Droplets, ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  rain: number;
  snow: number;
}

interface DailyForecast {
  day: string;
  date: string;
  icon: string;
  description: string;
  high: number;
  low: number;
}

interface Props {
  weather: WeatherData;
  communityName?: string;
  communityLat?: number;
  communityLng?: number;
}

export default function WeatherForecastPopover({ weather, communityName, communityLat, communityLng }: Props) {
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

  const fetchForecast = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const qs = communityLat && communityLng
        ? `?lat=${communityLat}&lon=${communityLng}`
        : "";
      const res = await fetch(
        `${supabaseUrl}/functions/v1/get-forecast${qs}`,
        { headers: { Authorization: `Bearer ${anonKey}`, apikey: anonKey } }
      );
      if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
      const data = await res.json();
      setForecast(data.forecast);
    } catch (e) {
      console.error("Failed to fetch forecast:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover onOpenChange={(open) => { if (open) fetchForecast(); }}>
      <PopoverTrigger asChild>
        <button className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 shrink-0 group cursor-pointer">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
            alt={weather.description}
            className="h-8 w-8 group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-foreground">{weather.temp}°C</span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {communityName || weather.description}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground pl-1 border-l border-border ml-1">
            <Wind className="h-3 w-3" />
            <span>{weather.wind_speed}<span className="hidden lg:inline">km/h</span></span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-1 group-hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        {/* Current Conditions */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="h-14 w-14 -ml-2 -mt-1"
            />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground">{weather.temp}°C</div>
              <div className="text-xs text-muted-foreground capitalize">{weather.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" /> Feels {weather.feels_like}°C
            </span>
            <span className="flex items-center gap-1">
              <Wind className="h-3 w-3" /> {weather.wind_speed} km/h
            </span>
            {(weather.rain > 0 || weather.snow > 0) && (
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                {weather.snow > 0 ? `${weather.snow} mm snow` : `${weather.rain} mm rain`}
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* 5-Day Forecast */}
        <div className="px-4 py-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            5-Day Forecast
          </div>
          {loading && !forecast && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          )}
          {forecast && (
            <div className="space-y-1">
              {forecast.map((day) => (
                <div key={day.date} className="flex items-center gap-2 py-0.5">
                  <span className="text-xs font-medium text-foreground w-8">{day.day}</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.description}
                    className="h-7 w-7"
                  />
                  <span className="text-xs text-foreground font-semibold">{day.high}°</span>
                  <span className="text-xs text-muted-foreground">{day.low}°</span>
                  <span className="text-[10px] text-muted-foreground capitalize ml-auto truncate max-w-[80px]">
                    {day.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* CTA */}
        <div className="p-3">
          <Button
            variant="cta"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate("/estimate")}
          >
            Storm damage? Get a free estimate
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
